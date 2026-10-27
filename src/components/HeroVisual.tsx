'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  KeyRound, 
  Zap, 
  TrendingUp, 
  Sparkles, 
  Activity
} from 'lucide-react';

export const MetaLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6.915 4.03c-2.38 0-4.47 1.25-5.69 3.19C.45 8.48 0 9.77 0 11.16c0 1.39.45 2.68 1.225 3.94 1.22 1.94 3.31 3.19 5.69 3.19 2.33 0 4.38-1.2 5.625-3.08 1.245 1.88 3.295 3.08 5.625 3.08 2.38 0 4.47-1.25 5.69-3.19.775-1.26 1.225-2.55 1.225-3.94 0-1.39-.45-2.68-1.225-3.94-1.22-1.94-3.31-3.19-5.69-3.19-2.33 0-4.38 1.2-5.625 3.08-1.245-1.88-3.295-3.08-5.625-3.08zm0 2.22c1.7 0 3.25.96 4.14 2.51l.945 1.64.945-1.64c.89-1.55 2.44-2.51 4.14-2.51 1.76 0 3.32.99 4.19 2.54.58.98.92 1.95.92 2.87 0 .92-.34 1.89-.92 2.87-.87 1.55-2.43 2.54-4.19 2.54-1.7 0-3.25-.96-4.14-2.51l-.945-1.64-.945 1.64c-.89 1.55-2.44 2.51-4.14 2.51-1.76 0-3.32-.99-4.19-2.54-.58-.98-.92-1.95-.92-2.87 0-.92.34-1.89.92-2.87.87-1.55 2.43-2.54 4.19-2.54z" />
  </svg>
);

export const FacebookLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const TikTokLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.32 0 .63.05.92.14V9.43a6.34 6.34 0 0 0-.92-.07 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.84 1.55V6.85a4.85 4.85 0 0 1-1.08-.16z" />
  </svg>
);

export const SalesLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export function HeroVisual() {
  return (
    <div className="relative w-full max-w-2xl mx-auto select-none overflow-hidden sm:overflow-visible">
      {/* Subtle Laser Beams */}
      <div className="hero-beams" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      {/* Floating Ambient Brand Badges (Desktop) */}
      <div className="hidden xl:block pointer-events-none">
        {/* Top-Left: Meta BM2500 Badge */}
        <Link 
          href="/product/facebook-bm2500"
          className="pointer-events-auto absolute -top-4 -left-6 z-20 anim-hero-float-1 group"
        >
          <div className="card-glass py-2 px-3.5 rounded-xl border border-[#CBD5E1] flex items-center gap-2.5 shadow-md group-hover:border-[#FBAD18] transition-all bg-white">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#FBAD18]/15 border border-[#FBAD18]/30 text-[#D97706]">
              <span className="absolute inset-0 rounded-lg anim-radar bg-[#FBAD18]/20" />
              <MetaLogo className="w-4 h-4 relative z-10" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#D97706] transition-colors">Meta BM</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              </div>
              <span className="text-[10px] text-[#64748B] font-mono">$2,500 Daily Spend</span>
            </div>
          </div>
        </Link>

        {/* Top-Right: Facebook Ads Badge */}
        <Link 
          href="/shop"
          className="pointer-events-auto absolute -top-4 -right-4 z-20 anim-hero-float-2 group"
        >
          <div className="card-glass py-2 px-3.5 rounded-xl border border-[#CBD5E1] flex items-center gap-2.5 shadow-md group-hover:border-[#FBAD18] transition-all bg-white">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#1877F2]/15 border border-[#1877F2]/30 text-[#1877F2]">
              <FacebookLogo className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#D97706] transition-colors">Facebook Assets</span>
                <span className="text-[9px] text-[#B45309] font-bold px-1 bg-[#FBAD18]/20 rounded">VERIFIED</span>
              </div>
              <span className="text-[10px] text-[#64748B] font-mono">3-Line Reinstated</span>
            </div>
          </div>
        </Link>

        {/* Bottom-Left: TikTok Ads Badge */}
        <Link 
          href="/shop"
          className="pointer-events-auto absolute -bottom-3 -left-4 z-20 anim-hero-float-3 group"
        >
          <div className="card-glass py-2 px-3.5 rounded-xl border border-[#CBD5E1] flex items-center gap-2.5 shadow-md group-hover:border-[#FBAD18] transition-all bg-white">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#0F172A]/10 border border-[#CBD5E1] text-[#0F172A]">
              <TikTokLogo className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#D97706] transition-colors">TikTok Agency</span>
                <Sparkles className="w-2.5 h-2.5 text-[#FE2C55]" />
              </div>
              <span className="text-[10px] text-[#64748B] font-mono">Worldwide Target</span>
            </div>
          </div>
        </Link>

        {/* Bottom-Right: Sales Scale Badge */}
        <Link 
          href="/shop"
          className="pointer-events-auto absolute -bottom-3 -right-4 z-20 anim-hero-float-4 group"
        >
          <div className="card-glass py-2 px-3.5 rounded-xl border border-[#CBD5E1] flex items-center gap-2.5 shadow-md group-hover:border-[#FBAD18] transition-all bg-white">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]">
              <span className="absolute inset-0 rounded-lg anim-radar bg-[#10B981]/20" />
              <SalesLogo className="w-4 h-4 relative z-10" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#10B981] transition-colors">Sales Boost</span>
                <Activity className="w-2.5 h-2.5 text-[#10B981] animate-pulse" />
              </div>
              <span className="text-[10px] text-[#64748B] font-mono">10x Scale Potential</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Orbit Stage */}
      <div className="orbit-container relative flex items-center justify-center py-4 sm:py-6">
        <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] flex items-center justify-center">

          {/* Background Concentric Circles */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none opacity-60" 
            viewBox="0 0 420 420"
          >
            <circle cx="210" cy="210" r="205" fill="none" stroke="rgba(203, 213, 225, 0.8)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="210" cy="210" r="148" fill="none" stroke="rgba(251, 173, 24, 0.4)" strokeWidth="1" />
            <circle cx="210" cy="210" r="92" fill="none" stroke="rgba(203, 213, 225, 0.9)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="210" cy="5" r="3.5" fill="#FBAD18" />
            <circle cx="385" cy="210" r="3" fill="#10B981" />
            <circle cx="35" cy="210" r="3" fill="#1877F2" />
            <circle cx="210" cy="385" r="3" fill="#FBAD18" />
          </svg>

          {/* Outer Dashed Rotating Ring (Clockwise) */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#CBD5E1] anim-orbit-cw">
            
            {/* SATELLITE 1: 0° - META */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="anim-orbit-ccw">
                <Link 
                  href="/shop"
                  className="flex flex-col items-center group cursor-pointer"
                  title="Meta Assets & BMs"
                >
                  <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#CBD5E1] shadow-md group-hover:scale-110 group-hover:border-[#FBAD18] transition-all">
                    <span className="absolute inset-0 rounded-xl anim-radar bg-[#FBAD18]/20" />
                    <MetaLogo className="w-5 h-5 sm:w-6 sm:h-6 text-[#1877F2] relative z-10" />
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold text-[#0F172A] bg-white border border-[#CBD5E1] whitespace-nowrap shadow-xs group-hover:text-[#D97706] transition-colors">
                    Meta BM
                  </span>
                </Link>
              </div>
            </div>

            {/* SATELLITE 2: 60° - FACEBOOK */}
            <div className="absolute top-[25%] right-[7%] translate-x-1/2 -translate-y-1/2">
              <div className="anim-orbit-ccw">
                <Link 
                  href="/shop"
                  className="flex flex-col items-center group cursor-pointer"
                  title="Facebook Ads Accounts"
                >
                  <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#CBD5E1] shadow-md group-hover:scale-110 group-hover:border-[#FBAD18] transition-all">
                    <FacebookLogo className="w-5 h-5 sm:w-6 sm:h-6 text-[#1877F2]" />
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold text-[#0F172A] bg-white border border-[#CBD5E1] whitespace-nowrap shadow-xs group-hover:text-[#1877F2] transition-colors">
                    Facebook
                  </span>
                </Link>
              </div>
            </div>

            {/* SATELLITE 3: 120° - SALES */}
            <div className="absolute bottom-[25%] right-[7%] translate-x-1/2 translate-y-1/2">
              <div className="anim-orbit-ccw">
                <Link 
                  href="/shop"
                  className="flex flex-col items-center group cursor-pointer"
                  title="Scale Sales & Revenue"
                >
                  <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#CBD5E1] shadow-md group-hover:scale-110 group-hover:border-[#10B981] transition-all">
                    <span className="absolute inset-0 rounded-xl anim-radar bg-[#10B981]/20" />
                    <SalesLogo className="w-5 h-5 sm:w-6 sm:h-6 text-[#10B981] relative z-10" />
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold text-[#0F172A] bg-white border border-[#CBD5E1] whitespace-nowrap shadow-xs group-hover:text-[#10B981] transition-colors">
                    Sales Scale
                  </span>
                </Link>
              </div>
            </div>

            {/* SATELLITE 4: 180° - TIKTOK */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <div className="anim-orbit-ccw">
                <Link 
                  href="/shop"
                  className="flex flex-col items-center group cursor-pointer"
                  title="TikTok Agency Ads"
                >
                  <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#CBD5E1] shadow-md group-hover:scale-110 group-hover:border-[#FE2C55] transition-all">
                    <TikTokLogo className="w-5 h-5 sm:w-6 sm:h-6 text-[#0F172A]" />
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold text-[#0F172A] bg-white border border-[#CBD5E1] whitespace-nowrap shadow-xs group-hover:text-[#FE2C55] transition-colors">
                    TikTok Ads
                  </span>
                </Link>
              </div>
            </div>

            {/* SATELLITE 5: 240° - BM2500 */}
            <div className="absolute bottom-[25%] left-[7%] -translate-x-1/2 translate-y-1/2">
              <div className="anim-orbit-ccw">
                <Link 
                  href="/product/facebook-bm2500"
                  className="flex flex-col items-center group cursor-pointer"
                  title="High Limit BM2500"
                >
                  <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#FBAD18] shadow-md group-hover:scale-110 transition-all">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#D97706] anim-icon-beat fill-current" />
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold text-[#0F172A] bg-white border border-[#CBD5E1] whitespace-nowrap shadow-xs group-hover:text-[#D97706] transition-colors">
                    $2.5K Limit
                  </span>
                </Link>
              </div>
            </div>

            {/* SATELLITE 6: 300° - 2FA */}
            <div className="absolute top-[25%] left-[7%] -translate-x-1/2 -translate-y-1/2">
              <div className="anim-orbit-ccw">
                <Link 
                  href="/fb-2fa"
                  className="flex flex-col items-center group cursor-pointer"
                  title="2FA Security Authenticator"
                >
                  <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#CBD5E1] shadow-md group-hover:scale-110 group-hover:border-[#FBAD18] transition-all">
                    <KeyRound className="w-5 h-5 sm:w-6 sm:h-6 text-[#D97706] anim-key" />
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold text-[#0F172A] bg-white border border-[#CBD5E1] whitespace-nowrap shadow-xs group-hover:text-[#D97706] transition-colors">
                    2FA Live
                  </span>
                </Link>
              </div>
            </div>

          </div>

          {/* Inner Counter-Rotating Ring */}
          <div className="absolute w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] rounded-full border border-dotted border-[#CBD5E1] anim-orbit-ccw-fast pointer-events-none">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#FBAD18] shadow-[0_0_8px_#FBAD18]" />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
          </div>

          {/* CENTRAL CORE */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-[#FBAD18]/40 anim-ringpulse pointer-events-none" />
            <span className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-[#FBAD18]/25 anim-ringpulse-delayed pointer-events-none" />

            <div className="relative w-18 h-18 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-[#FFFBEB] via-white to-[#EDF0F2] border-2 border-[#FBAD18] flex items-center justify-center anim-orbpulse shadow-xl">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#FBAD18] to-[#F59E0B] flex items-center justify-center shadow-md anim-icon-beat">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#0F172A]" />
              </div>
            </div>

            <div className="absolute -bottom-8 whitespace-nowrap z-20">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#CBD5E1] shadow-md text-[10px] font-bold text-[#0F172A]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                <span className="text-[#D97706] font-black">BM4U</span>
                <span className="text-[#94A3B8]">•</span>
                <span className="text-[#0F172A]">LIVE ASSET NETWORK</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div className="text-center pt-5">
        <span className="text-[11px] text-[#64748B] font-mono inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FBAD18]" />
          Hover any node to inspect live specifications
        </span>
      </div>

    </div>
  );
}
