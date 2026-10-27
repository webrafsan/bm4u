'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Package, Clock, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TrackOrderPage() {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('bm4u_orders') || '[]');
      setOrders(stored);
      if (stored.length > 0) {
        setSearchedOrder(stored[0]);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const clean = orderIdInput.trim().toUpperCase();
    const found = orders.find(o => o.orderId.toUpperCase() === clean);
    setSearchedOrder(found || null);
  };

  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
      <Navbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <div className="mx-auto max-w-4xl space-y-10">
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 badge-calon text-xs mb-3">
              <Package className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Order Tracking & Fulfillment</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
              Track Your <span className="text-gradient">Orders & Delivery</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto font-medium">
              Look up your purchase status and view delivered advertising credentials.
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
              <button type="submit" className="btn-pill btn-primary py-3.5 px-8 text-xs font-bold flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                <span>Track Order</span>
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
                  <span className="badge-calon text-xs py-1 px-3">
                    {searchedOrder.status || 'Active'}
                  </span>
                  <span className="text-[11px] text-[#64748B] block mt-1 font-medium">
                    Placed: {new Date(searchedOrder.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-3">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#475569]">
                  Purchased Items
                </h4>
                <div className="space-y-2">
                  {searchedOrder.items.map(({ product, quantity }: any) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#EDF0F2] border border-[#CBD5E1] text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#0F172A] block">
                          {product.title}
                        </span>
                        <span className="text-[11px] text-[#D97706] font-mono font-bold">
                          Format: {product.format}
                        </span>
                      </div>
                      <span className="font-black text-[#0F172A] shrink-0 font-mono">
                        {quantity} × ${product.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Telegram Delivery Direct Button */}
              <div className="p-4 rounded-2xl bg-[#EDF0F2] border border-[#CBD5E1] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Send className="w-5 h-5 text-[#D97706] shrink-0" />
                  <div className="text-xs text-[#475569]">
                    <span className="font-bold text-[#0F172A] block">Instant Credential Dispatch</span>
                    <span>Confirm with our Telegram dispatcher to receive account access immediately.</span>
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
              No order found matching &quot;{orderIdInput}&quot;. Please verify the order number or check Telegram support.
            </div>
          ) : orders.length === 0 ? (
            <div className="card-glass rounded-2xl p-8 text-center text-xs text-[#64748B] bg-white border border-[#CBD5E1]">
              No recent orders found in this browser. Enter an Order ID above to track.
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
