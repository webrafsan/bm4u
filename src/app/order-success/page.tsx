'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CheckCircle2, 
  Send, 
  Copy, 
  Check, 
  ArrowRight, 
  Clock, 
  Package, 
  Coins
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CRYPTO_WALLETS, CryptoWallet } from '@/data/cryptoWallets';

interface OrderItem {
  product: {
    id: string;
    title: string;
    price: number;
    format?: string;
  };
  quantity: number;
}

interface StoredOrder {
  orderId: string;
  customer: {
    fullName: string;
    email: string;
    telegram: string;
    paymentMethod: string;
    selectedCrypto?: string;
    txid?: string;
    orderNotes?: string;
  };
  cryptoWallet?: CryptoWallet;
  txid?: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: string;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'BM-849201';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [inputTxid, setInputTxid] = useState('');
  const [txidSubmitted, setTxidSubmitted] = useState(false);

  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem('bm4u_orders') || '[]');
      const found = orders.find((o: StoredOrder) => o.orderId === orderId);
      if (found) {
        setOrder(found);
        if (found.txid) {
          setInputTxid(found.txid);
          setTxidSubmitted(true);
        }
      }
    } catch {
      // ignore
    }
  }, [orderId]);

  const activeWallet: CryptoWallet =
    order?.cryptoWallet ||
    CRYPTO_WALLETS.find((w) => w.symbol === order?.customer?.selectedCrypto) ||
    CRYPTO_WALLETS[0];

  const currentTxid = inputTxid.trim() || order?.txid || '';

  const copyToClipboard = async (text: string, keyName: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedKey(keyName);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // fallback
    }
  };

  const handleSaveTxid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTxid.trim()) return;

    try {
      const orders = JSON.parse(localStorage.getItem('bm4u_orders') || '[]');
      const idx = orders.findIndex((o: StoredOrder) => o.orderId === orderId);
      if (idx !== -1) {
        orders[idx].txid = inputTxid.trim();
        localStorage.setItem('bm4u_orders', JSON.stringify(orders));
      }
      setTxidSubmitted(true);
    } catch {
      // ignore
    }
  };

  const telegramConfirmUrl = `https://t.me/bybm4u?text=${encodeURIComponent(
    `Hello BM4U Fulfillment Desk, I have placed order #${orderId}.\nTotal: $${order?.total || '0'} USD\nPayment Crypto: ${activeWallet.name} (${activeWallet.symbol}) - ${activeWallet.network}\nWallet: ${activeWallet.address}\nTXID: ${currentTxid || 'Pending'}\nClient Telegram: ${order?.customer?.telegram || ''}`
  )}`;

  return (
    <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-cosmic relative text-[#0F172A]">
      <div className="mx-auto max-w-3xl space-y-8">
        
        {/* Success Card Header */}
        <div className="card-glass rounded-3xl p-8 sm:p-12 border border-[#CBD5E1] shadow-lg text-center space-y-6 bg-white">
          <div className="h-20 w-20 rounded-full bg-[#ECFDF5] border border-[#10B981]/40 flex items-center justify-center text-[#10B981] mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="badge-calon text-xs py-1 px-3 mb-2 inline-block">
              Order Registered Successfully
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-2">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-medium">
              Your order reference number is: <strong className="text-[#0F172A] font-mono text-base font-black">{orderId}</strong>
            </p>
          </div>

          {/* Purchased Items Breakdown */}
          {order && order.items && order.items.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#EDF0F2] border border-[#CBD5E1] text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1] text-xs text-[#64748B]">
                <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#D97706]" /> Purchased Items ({order.items.length})
                </span>
                <span>Grand Total: <strong className="text-[#0F172A] font-mono text-sm font-black">${order.total.toFixed(2)} USD</strong></span>
              </div>
              <div className="space-y-2">
                {order.items.map(({ product, quantity }, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <span className="text-[#0F172A] font-semibold truncate max-w-xs">{product.title}</span>
                    <span className="font-mono text-[#0F172A] shrink-0 font-bold">
                      {quantity} × ${product.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Instructions Box - Exact bm4u.net Crypto */}
          <div className="p-6 rounded-2xl bg-[#EDF0F2] border border-[#CBD5E1] text-left space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]">
              <span className="font-heading text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#D97706]" />
                Payment Wallet: {activeWallet.name} ({activeWallet.symbol})
              </span>
              <span className="text-xs text-[#10B981] font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Instant Delivery
              </span>
            </div>

            {/* Instruction banner */}
            <div className="bg-[#FFFBEB] border-l-4 border-[#FBAD18] px-4 py-3 rounded-r-lg text-[#92400E] text-xs leading-relaxed font-medium">
              Please transfer the exact total amount to the wallet address below and submit your TXID / Transaction Hash for verification.
            </div>

            {/* Card with QR Code and Address */}
            <div className="bg-white rounded-2xl p-5 border border-[#CBD5E1] shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-5 items-center">
                <div className="flex flex-col items-center justify-center bg-[#EDF0F2] p-3 rounded-xl border border-[#CBD5E1] shadow-xs w-full max-w-[160px] mx-auto">
                  <div className="bg-white p-2 rounded-lg">
                    <Image
                      src={activeWallet.qrCode}
                      alt={`${activeWallet.name} QR Code`}
                      width={120}
                      height={120}
                      className="rounded-md object-contain"
                      priority
                    />
                  </div>
                  <span className="text-[10px] text-[#64748B] font-extrabold uppercase tracking-wider mt-2">
                    Scan QR Code
                  </span>
                </div>

                <div className="space-y-3 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#0F172A] text-base">
                      {activeWallet.name} ({activeWallet.symbol})
                    </span>
                    <span className="text-xs bg-[#FFFBEB] text-[#B45309] px-2.5 py-0.5 rounded-md font-bold border border-[#FBAD18]/40">
                      {activeWallet.network}
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#64748B] font-bold block mb-1">
                      Deposit Address (Click to Copy)
                    </label>
                    <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#EDF0F2] border border-[#CBD5E1] font-mono text-xs text-[#0F172A] font-bold break-all">
                      <span
                        onClick={() => copyToClipboard(activeWallet.address, 'wallet')}
                        className="cursor-pointer hover:underline select-all"
                        title="Click to copy"
                      >
                        {activeWallet.address}
                      </span>
                      <button
                        onClick={() => copyToClipboard(activeWallet.address, 'wallet')}
                        className="p-1.5 rounded-lg bg-white hover:bg-[#FBAD18] text-[#0F172A] shrink-0 cursor-pointer border border-[#CBD5E1]"
                        title="Copy Wallet Address"
                      >
                        {copiedKey === 'wallet' ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TXID Submission & Display */}
            <div className="bg-white rounded-2xl p-4 border border-dashed border-[#CBD5E1]">
              <h4 className="text-xs font-bold text-[#0F172A] mb-2">
                Payment Transaction Hash (TXID):
              </h4>
              <form onSubmit={handleSaveTxid} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Paste your Transaction Hash / TXID..."
                  value={inputTxid}
                  onChange={(e) => setInputTxid(e.target.value)}
                  className="flex-1 bg-[#EDF0F2] border border-[#CBD5E1] text-[#0F172A] placeholder:text-[#94A3B8] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FBAD18]"
                />
                <button
                  type="submit"
                  className="btn-action btn-primary text-xs py-2 px-4 rounded-xl cursor-pointer shrink-0 font-bold"
                >
                  {txidSubmitted ? 'Saved ✓' : 'Save TXID'}
                </button>
              </form>
              {currentTxid && (
                <div className="mt-2 text-[11px] text-[#10B981] font-mono break-all font-bold">
                  Recorded TXID: <code>{currentTxid}</code>
                </div>
              )}
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed font-medium">
              Once payment is sent, click the button below to message our 24/7 fulfillment desk on Telegram with your Order ID (<strong className="text-[#0F172A]">{orderId}</strong>) to receive your access credentials instantly.
            </p>

            <a
              href={telegramConfirmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-action btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-xl cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Confirm & Receive Account on Telegram</span>
            </a>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-[#CBD5E1] text-xs">
            <Link href="/track-order" className="text-[#D97706] hover:underline flex items-center gap-1 font-bold">
              <span>View Order Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[#CBD5E1] hidden sm:inline">•</span>
            <Link href="/shop" className="text-[#64748B] hover:text-[#0F172A] font-semibold">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-[#D97706] font-bold">Loading order summary...</div>}>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
