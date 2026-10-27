'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Send 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ReplaceRulesPage() {
  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
      <Navbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <div className="mx-auto max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 badge-calon text-xs mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Customer Guarantee & Protection</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4">
              Replacement <span className="text-gradient">Rules & Policy</span>
            </h1>
            <p className="text-[#475569] text-base max-w-xl mx-auto leading-relaxed font-normal">
              We want all of our customers to experience seamless operations at BM4U. If your delivered product encounters a verified technical defect, review our policy below.
            </p>
          </div>

          {/* 24-Hour Guarantee Highlight Card */}
          <div className="card-glass rounded-3xl p-8 border border-[#CBD5E1] shadow-md mb-10 relative overflow-hidden bg-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-[#FFFBEB] border border-[#FBAD18]/40 flex items-center justify-center text-[#D97706] shrink-0">
                <Clock className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="badge-calon text-[11px] py-0.5 px-2.5 mb-1 inline-block">
                  Universal Standard
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#0F172A]">
                  Strict 24-Hour Technical Warranty
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                  All accounts and Business Managers carry a 24-hour guarantee starting from the exact timestamp of delivery. Any technical problem must be reported to our Telegram support team within this window.
                </p>
              </div>
            </div>
          </div>

          {/* Grid: Covered vs Not Covered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            
            {/* Eligible for Replacement */}
            <div className="card-glass rounded-3xl p-6 sm:p-8 border border-[#A7F3D0] shadow-sm space-y-4 bg-white">
              <div className="flex items-center gap-3 text-[#10B981]">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="font-heading text-lg font-bold text-[#0F172A]">
                  Eligible for Replacement
                </h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#334155]">
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] mt-2 shrink-0" />
                  <span>The delivered product is not as described on the product page.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] mt-2 shrink-0" />
                  <span>The account UID returns <strong className="text-[#DC2626]">DIE</strong> upon delivery (verified on our Live UID Checker prior to login).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] mt-2 shrink-0" />
                  <span>2FA secret key is corrupted or unable to generate valid TOTP codes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] mt-2 shrink-0" />
                  <span>Primary email or checkpoint access is non-functional upon initial test.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] mt-2 shrink-0" />
                  <span>Issue is reported within 24 hours of delivery with full screenshots/recordings.</span>
                </li>
              </ul>
            </div>

            {/* NOT Covered */}
            <div className="card-glass rounded-3xl p-6 sm:p-8 border border-[#FECACA] shadow-sm space-y-4 bg-white">
              <div className="flex items-center gap-3 text-[#EF4444]">
                <XCircle className="w-6 h-6" />
                <h3 className="font-heading text-lg font-bold text-[#0F172A]">
                  What Is Not Covered
                </h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#475569]">
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] mt-2 shrink-0" />
                  <span>Account banned due to violating Meta advertising policies, promoting blackhat/prohibited offers, or payment card declines.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] mt-2 shrink-0" />
                  <span>Immediate password or email modification without allowing session cookies to warm up.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] mt-2 shrink-0" />
                  <span>Using low-quality, datacenter, or shared proxies flagged by security algorithms.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] mt-2 shrink-0" />
                  <span>Reports submitted after the 24-hour guarantee window has elapsed.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] mt-2 shrink-0" />
                  <span>Change of mind or accidental purchases.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step-by-Step Claim Process */}
          <div className="card-glass rounded-3xl p-8 border border-[#CBD5E1] mb-12 space-y-6 bg-white shadow-sm">
            <h3 className="font-heading text-xl font-bold text-[#0F172A]">
              How to Submit a Replacement Request
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-[#EDF0F2] border border-[#CBD5E1] space-y-2">
                <span className="font-heading text-2xl font-black text-[#0F172A]">01</span>
                <h4 className="font-bold text-[#0F172A] text-sm">Verify UID Status</h4>
                <p className="text-xs text-[#64748B]">
                  Run the UID in our <Link href="/live-uid-checker" className="text-[#D97706] underline font-bold">Live UID Checker</Link> and take a screenshot showing the timestamp.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#EDF0F2] border border-[#CBD5E1] space-y-2">
                <span className="font-heading text-2xl font-black text-[#0F172A]">02</span>
                <h4 className="font-bold text-[#0F172A] text-sm">Collect Order Details</h4>
                <p className="text-xs text-[#64748B]">
                  Prepare your Order ID, purchase timestamp, and description of the technical impediment.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#EDF0F2] border border-[#CBD5E1] space-y-2">
                <span className="font-heading text-2xl font-black text-[#0F172A]">03</span>
                <h4 className="font-bold text-[#0F172A] text-sm">Message Telegram</h4>
                <p className="text-xs text-[#64748B]">
                  Contact our 24/7 fulfillment team at <a href="https://t.me/bybm4u" className="text-[#D97706] underline font-bold">@bybm4u</a> for replacement processing.
                </p>
              </div>
            </div>

            <div className="pt-4 text-center">
              <a
                href="https://t.me/bybm4u"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action btn-primary py-3.5 px-8 text-sm font-bold inline-flex items-center gap-2 rounded-xl"
              >
                <Send className="w-4 h-4" />
                <span>Contact Telegram Replacement Desk</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
