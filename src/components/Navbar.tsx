'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Send,
  KeyRound,
  UserCheck,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const Navbar = () => {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { 
      href: '/', 
      label: 'Home' 
    },
    { 
      href: '/shop', 
      label: 'Shop',
      icon: ShoppingBag,
      iconColor: 'text-[#D97706]'
    },
    { 
      href: '/fb-2fa', 
      label: '2FA Tool', 
      badge: 'Tool',
      icon: KeyRound,
      iconClass: 'anim-key text-[#D97706]'
    },
    { 
      href: '/live-uid-checker', 
      label: 'Live UID Checker', 
      badge: 'Tool',
      icon: UserCheck,
      iconClass: 'text-[#10B981]',
      hasPulse: true
    },
    { 
      href: '/replace-rules', 
      label: 'Replace Rules',
      icon: ShieldCheck,
      iconClass: 'text-[#D97706]'
    },
    { 
      href: '/tips', 
      label: 'Tips',
      icon: BookOpen 
    },
    { 
      href: '/about-us', 
      label: 'About' 
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md transition-all duration-300 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        
        {/* Animated Brand Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative flex h-12 w-12 items-center justify-center shrink-0">
            {/* Animated Radar Ripple */}
            <span className="absolute inset-0 rounded-2xl bg-[#FBAD18]/25 anim-radar pointer-events-none" />
            
            {/* Rotating Orbit Ring */}
            <span className="absolute -inset-1 rounded-2xl border border-dashed border-[#FBAD18]/40 anim-orbit pointer-events-none" />

            {/* Core Brand Badge */}
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FBAD18] via-[#F59E0B] to-[#D97706] p-0.5 border border-[#FBAD18] anim-icon-beat shadow-md">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white overflow-hidden p-0.5">
                <Image
                  src="/logo-100.webp"
                  alt="BM Shop"
                  width={38}
                  height={38}
                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-xl font-bold tracking-tight text-[#0F172A] group-hover:text-[#D97706] transition-colors">
                BM Shop
              </span>
              <span className="flex h-2 w-2 rounded-full bg-[#FBAD18] animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#64748B]">
                Meta Ads Assets
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FBAD18]/20 text-[#B45309] font-bold">
                LIVE
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#EDF0F2] p-1.5 rounded-xl border border-[#CBD5E1]">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#FBAD18] text-[#2D3748] shadow-sm'
                    : 'text-[#475569] hover:bg-white hover:text-[#2D3748]'
                }`}
              >
                {Icon && (
                  <span className="relative flex items-center justify-center shrink-0">
                    <Icon
                      className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-[#2D3748]' : link.iconClass || link.iconColor || 'text-[#64748B]'
                      }`}
                    />
                    {link.hasPulse && (
                      <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-80" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]" />
                      </span>
                    )}
                  </span>
                )}

                <span>{link.label}</span>

                {link.badge && !isActive && (
                  <span className="rounded-md bg-[#FBAD18]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#B45309] border border-[#FBAD18]/40">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Telegram & Cart */}
        <div className="flex items-center gap-3">
          <a
            href="https://t.me/bybm4u"
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden sm:inline-flex items-center gap-2 btn-action btn-ghost text-xs py-2 px-4 rounded-xl font-bold"
          >
            <Send className="w-3.5 h-3.5 text-[#D97706] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>Telegram</span>
          </a>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="group relative flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-[#CBD5E1] text-[#2D3748] hover:border-[#FBAD18] hover:text-[#B45309] transition-all duration-200 cursor-pointer shadow-xs"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FBAD18] text-[10px] font-bold text-[#2D3748] animate-bounce shadow-md">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-[#CBD5E1] text-[#2D3748] cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E2E8F0] bg-white px-6 py-6 transition-all duration-300 shadow-lg">
          <div className="flex flex-col gap-2">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#FBAD18] text-[#2D3748] shadow-xs'
                      : 'text-[#475569] hover:bg-[#EDF0F2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-[#2D3748]' : 'text-[#D97706]'}`} />}
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="rounded-md bg-[#FBAD18]/25 px-2 py-0.5 text-[10px] text-[#B45309] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide bg-[#EDF0F2] border border-[#CBD5E1] text-[#2D3748] w-full hover:border-[#FBAD18] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#D97706]" />
                  <span>Shopping Cart</span>
                </div>
                <span className="rounded-md bg-[#FBAD18] px-2.5 py-0.5 text-xs text-[#2D3748] font-bold font-mono">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </button>

              <a
                href="https://t.me/bybm4u"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action btn-primary w-full text-center text-sm py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <Send className="w-4 h-4" />
                <span>Telegram Support</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
