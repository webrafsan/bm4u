'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, Clock, ShieldCheck, Send, CheckCircle2, Key, Copy, Check } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchLiveOrder = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders/${id.trim()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setSearchedOrder(data.data);
          return;
        }
      }
      // Fallback to localStorage if not found on server
      const stored = JSON.parse(localStorage.getItem('bm4u_orders') || '[]');
      const found = stored.find((o: any) => o.orderId.toUpperCase() === id.trim().toUpperCase());
      setSearchedOrder(found || null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setSearchedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setOrderIdInput(initialOrderId);
      fetchLiveOrder(initialOrderId);
    } else {
      // Check if user has an order in localStorage to display as default
      try {
        const stored = JSON.parse(localStorage.getItem('bm4u_orders') || '[]');
        if (stored.length > 0) {
          setOrderIdInput(stored[0].orderId);
          fetchLiveOrder(stored[0].orderId);
        }
      } catch {
        // ignore
      }
    }
  }, [initialOrderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLiveOrder(orderIdInput);
  };

  const handleCopyCredentials = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      
      <div className="text-center">
        <div className="inline-flex items-center gap-2 badge-calon text-xs mb-3">
          <Package className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Real-time Order Tracking & Fulfillment</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
          Track Your <span className="text-gradient">Orders & Delivery</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto font-medium">
          Look up live order progress from our MongoDB fulfillment database.
        </p>
      </div>

      {/* Search Box */}
      <div className="card-glass rounded-3xl p-6 sm:p-8 border border-[#CBD5E1] shadow-md bg-white">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter your Order ID (e.g. BM-849102)"
            value={orderIdInput}
            onChange={e => setOrderIdInput(e.target.value)}
            className="flex-1 bg-[#EDF0F2] border border-[#CBD5E1] rounded-2xl px-5 py-3.5 text-[#0F172A] text-sm font-mono placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FBAD18] font-bold"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="btn-pill btn-primary py-3.5 px-8 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Search className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Searching...' : 'Track Order'}</span>
          </button>
        </form>
      </div>

      {/* Result Display */}
      {searchedOrder ? (
        <div className="card-glass rounded-3xl p-6 sm:p-8 border border-[#CBD5E1] space-y-6 bg-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#64748B] block font-bold">Order Reference</span>
              <h3 className="font-heading text-xl font-black text-[#0F172A] font-mono">
                {searchedOrder.orderId}
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold inline-block ${
                searchedOrder.status === 'Completed'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : searchedOrder.status === 'Payment Verified'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : searchedOrder.status === 'Cancelled'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {searchedOrder.status || 'Awaiting Payment'}
              </span>
              <span className="text-[11px] text-[#64748B] block mt-1 font-medium">
                Placed: {new Date(searchedOrder.createdAt || searchedOrder.date || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* DELIVERED ASSETS / CREDENTIALS (IF DISPATCHED BY ADMIN) */}
          {searchedOrder.deliveryCredentials && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <Key className="w-4 h-4 text-emerald-600" />
                  <span>Your Delivered Advertising Credentials</span>
                </div>
                <button
                  onClick={() => handleCopyCredentials(searchedOrder.deliveryCredentials)}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300 flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Credentials'}</span>
                </button>
              </div>
              <pre className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-xs text-[#0F172A] overflow-x-auto whitespace-pre-wrap">
                {searchedOrder.deliveryCredentials}
              </pre>
            </div>
          )}

          {/* Items in order */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#475569]">
              Purchased Items
            </h4>
            <div className="space-y-2">
              {searchedOrder.items?.map(({ product, quantity }: any, idx: number) => (
                <div
                  key={product?.id || idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#EDF0F2] border border-[#CBD5E1] text-xs"
                >
                  <div>
                    <span className="font-bold text-[#0F172A] block">
                      {product?.title || 'Meta Advertising Asset'}
                    </span>
                    <span className="text-[11px] text-[#D97706] font-mono font-bold">
                      Format: {product?.format || 'Direct Delivery'}
                    </span>
                  </div>
                  <span className="font-black text-[#0F172A] shrink-0 font-mono">
                    {quantity} × ${(product?.price || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Total breakdown */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
            <div>
              <span className="text-[#64748B] block font-medium">Payment Method</span>
              <span className="font-bold text-[#0F172A]">
                {searchedOrder.customer?.selectedCrypto || searchedOrder.cryptoWallet?.symbol || 'Cryptocurrency'}
                {searchedOrder.txid ? ` (TXID: ${searchedOrder.txid.slice(0, 12)}...)` : ''}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#64748B] block font-medium">Total Paid</span>
              <span className="font-black text-sm text-[#0F172A]">
                ${(searchedOrder.total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Telegram Delivery Direct Button */}
          <div className="p-4 rounded-2xl bg-[#EDF0F2] border border-[#CBD5E1] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Send className="w-5 h-5 text-[#D97706] shrink-0" />
              <div className="text-xs text-[#475569]">
                <span className="font-bold text-[#0F172A] block">Fulfillment Support Desk</span>
                <span>Need immediate verification or replacement? Contact our 24/7 Telegram dispatch team.</span>
              </div>
            </div>
            <a
              href={`https://t.me/bybm4u?text=Hello Support, checking order ${searchedOrder.orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-primary text-xs py-2 px-5 shrink-0 font-bold"
            >
              Contact Telegram
            </a>
          </div>
        </div>
      ) : searched ? (
        <div className="card-glass rounded-2xl p-8 text-center text-xs text-[#64748B] bg-white border border-[#CBD5E1]">
          No order found matching &quot;{orderIdInput}&quot;. Please verify the order number or contact Telegram support.
        </div>
      ) : (
        <div className="card-glass rounded-2xl p-8 text-center text-xs text-[#64748B] bg-white border border-[#CBD5E1]">
          Enter your Order ID above to check live status and access details.
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
      <Navbar />
      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <Suspense fallback={<div className="p-12 text-center text-xs">Loading order tracker...</div>}>
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
