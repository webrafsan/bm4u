'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Copy, Check } from 'lucide-react';
import { CRYPTO_WALLETS, CryptoWallet } from '@/data/cryptoWallets';

interface CryptoPaymentGatewayProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  txid: string;
  onChangeTxid: (txid: string) => void;
}

export function CryptoPaymentGateway({
  selectedSymbol,
  onSelectSymbol,
  txid,
  onChangeTxid,
}: CryptoPaymentGatewayProps) {
  const [copied, setCopied] = useState(false);

  const activeWallet: CryptoWallet =
    CRYPTO_WALLETS.find((w) => w.symbol === selectedSymbol) || CRYPTO_WALLETS[0];

  const handleCopy = async (address: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(address);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="w-full text-[#0F172A] font-sans">
      {/* Alert Instruction Box */}
      <div className="bg-[#FFFBEB] border-l-4 border-[#FBAD18] px-4 py-3.5 rounded-r-lg mb-5 text-[#92400E] text-xs sm:text-sm leading-relaxed shadow-xs">
        <p className="font-medium">
          Please transfer the exact total amount to one of our cryptocurrency wallets below and submit your TXID / Transaction Hash for manual verification.
        </p>
      </div>

      {/* Crypto Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CRYPTO_WALLETS.map((wallet) => {
          const isActive = wallet.symbol === activeWallet.symbol;
          return (
            <button
              key={wallet.id}
              type="button"
              onClick={() => {
                onSelectSymbol(wallet.symbol);
                setCopied(false);
              }}
              className={`flex-1 min-w-[110px] sm:min-w-0 py-2.5 px-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] ${
                isActive
                  ? 'bg-[#FBAD18] text-[#2D3748] border border-[#E69D0E] shadow-[0_4px_14px_rgba(251,173,24,0.35)]'
                  : 'bg-white border border-[#CBD5E1] text-[#475569] hover:text-[#2D3748] hover:bg-[#EDF0F2]'
              }`}
            >
              <span>{wallet.name}</span>
              <span className={`text-[11px] ${isActive ? 'text-[#2D3748]/85' : 'text-[#64748B]'}`}>
                ({wallet.symbol})
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Wallet Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#CBD5E1] mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 items-center">
          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center bg-[#EDF0F2] p-3.5 rounded-xl border border-[#CBD5E1] shadow-xs w-full max-w-[180px] mx-auto">
            <div className="relative w-[150px] h-[150px] bg-white rounded-lg p-2 flex items-center justify-center shadow-xs">
              <Image
                src={activeWallet.qrCode}
                alt={`${activeWallet.name} QR Code`}
                width={140}
                height={140}
                className="rounded-md object-contain"
                priority
              />
            </div>
            <span className="text-[11px] text-[#64748B] font-extrabold uppercase tracking-wider mt-2.5">
              Scan QR Code
            </span>
          </div>

          {/* Details & Address */}
          <div className="flex flex-col gap-3.5 min-w-0 text-left">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h4 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                {activeWallet.name} ({activeWallet.symbol})
              </h4>
              <span className="text-xs bg-[#FFFBEB] text-[#B45309] px-2.5 py-0.5 rounded-md font-bold border border-[#FBAD18]/40">
                {activeWallet.network}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#64748B] font-bold">
                Deposit Address (Click to Copy)
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl p-1.5 sm:pl-3.5 gap-2">
                <span
                  onClick={() => handleCopy(activeWallet.address)}
                  title="Click to copy address"
                  className="font-mono text-xs sm:text-sm text-[#0F172A] font-bold break-all flex-1 cursor-pointer hover:text-[#D97706] hover:underline px-2 py-1 select-all"
                >
                  {activeWallet.address}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(activeWallet.address)}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer min-h-[38px] ${
                    copied
                      ? 'bg-[#10B981] text-white shadow-md'
                      : 'bg-[#FBAD18] text-[#2D3748] hover:bg-[#E69D0E] shadow-[0_2px_8px_rgba(251,173,24,0.35)]'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TXID Input Section */}
      <div className="bg-white rounded-2xl p-5 border border-dashed border-[#CBD5E1] shadow-xs">
        <h4 className="text-sm font-bold text-[#0F172A] mb-2">
          Submit Payment Transaction Hash (TXID){' '}
          <span className="text-xs font-normal text-[#64748B]">(Optional)</span>
        </h4>

        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          <div className="sm:w-44 shrink-0">
            <select
              value={`${activeWallet.name} (${activeWallet.symbol})`}
              onChange={(e) => {
                const match = CRYPTO_WALLETS.find(
                  (w) => `${w.name} (${w.symbol})` === e.target.value
                );
                if (match) {
                  onSelectSymbol(match.symbol);
                }
              }}
              className="w-full bg-[#EDF0F2] border border-[#CBD5E1] text-[#0F172A] font-semibold rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#FBAD18] min-h-[42px] cursor-pointer"
            >
              {CRYPTO_WALLETS.map((w) => (
                <option key={w.id} value={`${w.name} (${w.symbol})`}>
                  {w.name} ({w.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <input
              type="text"
              value={txid}
              onChange={(e) => onChangeTxid(e.target.value)}
              placeholder="Paste your Transaction Hash / TXID (Optional)..."
              className="w-full bg-[#EDF0F2] border border-[#CBD5E1] text-[#0F172A] placeholder:text-[#94A3B8] rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#FBAD18] min-h-[42px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
