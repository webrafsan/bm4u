'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Send } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-[#CBD5E1] bg-[#E5E9EC] text-[#475569] pt-16 pb-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#CBD5E1]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FBAD18] to-[#D97706] p-0.5 shadow-sm">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white overflow-hidden p-0.5">
                  <Image
                    src="/logo-100.webp"
                    alt="BM Shop"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-[#0F172A]">
                BM Shop
              </span>
            </Link>
            
            <p className="text-sm leading-relaxed text-[#475569] max-w-sm">
              Premium Meta Business Managers, verified advertising accounts, high-limit BM2500, and advertising infrastructure for digital marketers, media buyers, and agencies.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me/bybm4u"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action btn-primary text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 font-bold"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Contact Telegram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-[#0F172A] tracking-wider uppercase">
              Products
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/shop" className="hover:text-[#D97706] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=business-manager" className="hover:text-[#D97706] transition-colors">
                  Business Managers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=verified-bm" className="hover:text-[#D97706] transition-colors">
                  Verified BMs
                </Link>
              </li>
              <li>
                <Link href="/shop?category=facebook-account" className="hover:text-[#D97706] transition-colors">
                  Facebook Accounts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tiktok-account" className="hover:text-[#D97706] transition-colors">
                  TikTok Accounts
                </Link>
              </li>
            </ul>
          </div>

          {/* Interactive Tools */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-[#0F172A] tracking-wider uppercase">
              Free Web Tools
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/fb-2fa" className="hover:text-[#D97706] transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FBAD18]" />
                  2FA Authenticator
                </Link>
              </li>
              <li>
                <Link href="/live-uid-checker" className="hover:text-[#D97706] transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  Live UID Checker
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-[#D97706] transition-colors">
                  Track Order / Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Policy */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-[#0F172A] tracking-wider uppercase">
              Support & Rules
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/replace-rules" className="hover:text-[#D97706] transition-colors">
                  24H Replace Rules
                </Link>
              </li>
              <li>
                <Link href="/tips" className="hover:text-[#D97706] transition-colors">
                  Tips & Guides
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-[#D97706] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="https://t.me/bybm4u"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D97706] transition-colors"
                >
                  Direct Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-8 border-b border-[#CBD5E1] space-y-2 text-xs leading-relaxed text-[#64748B]">
          <p>
            <strong className="text-[#334155]">Important Compliance Notice:</strong> All products and services listed on BM4U.net are intended for legitimate digital marketing and advertising management workflows. Customers are solely responsible for compliance with relevant laws, local regulations, and advertising platform terms of service. Meta, Facebook, and TikTok are registered trademarks of their respective owners. BM4U is an independent service provider and is not affiliated with or endorsed by Meta Platforms, Inc. or ByteDance Ltd.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4 font-medium">
          <p>© 2026 BM4U.net. All Rights Reserved. Built for speed and reliability.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#10B981] font-semibold">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
