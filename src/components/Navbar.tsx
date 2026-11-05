'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  ShoppingCart,
  Menu,
  X,
  KeyRound,
  UserCheck,
  ShieldCheck,
  BookOpen,
  Home,
  Info,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { TelegramIcon } from '@/components/icons/TelegramIcon';

const TELEGRAM_URL = 'https://t.me/bybm4u';

type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  // Extra path prefixes that should light up this link (e.g. product pages belong to Shop).
  matches?: string[];
};

const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Shop', icon: ShoppingBag, matches: ['/product', '/category'] },
  { href: '/fb-2fa', label: '2FA Tool', icon: KeyRound, badge: 'Free' },
  { href: '/live-uid-checker', label: 'UID Checker', icon: UserCheck, badge: 'Free' },
  { href: '/replace-rules', label: 'Replace Rules', icon: ShieldCheck },
  { href: '/tips', label: 'Guides', icon: BookOpen },
  { href: '/about-us', label: 'About', icon: Info },
];

function isLinkActive(pathname: string, link: NavLink) {
  if (link.href === '/') return pathname === '/';
  return [link.href, ...(link.matches ?? [])].some(p => pathname === p || pathname.startsWith(`${p}/`));
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group min-w-0" aria-label="BM 4 U home">
      <span className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FBAD18] via-[#F59E0B] to-[#D97706] p-0.5 shadow-sm">
        <span className="flex h-full w-full items-center justify-center rounded-[10px] bg-white overflow-hidden p-0.5">
          <Image
            src="/logo-100.webp"
            alt="BM 4 U"
            width={38}
            height={38}
            className="w-full h-full object-contain rounded-lg"
            priority
          />
        </span>
      </span>
      <span className="flex flex-col leading-tight min-w-0">
        <span className="flex items-center gap-1.5">
          <span className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-[#0F172A] group-hover:text-[#D97706] transition-colors">
            BM 4 U
          </span>
          <span className="flex items-center gap-1 rounded-md bg-[#10B981]/12 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-[#047857]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            </span>
            LIVE
          </span>
        </span>
        <span className="whitespace-nowrap text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-[#64748B]">
          Meta &amp; TikTok Assets
        </span>
      </span>
    </Link>
  );
}

export const Navbar = () => {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock page scroll and allow Escape to close while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const openCart = () => {
    setMenuOpen(false);
    setIsCartOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center gap-3 px-3 sm:px-6 lg:px-8">
          {/* Menu toggle (left on mobile / tablet) */}
          <button
            onClick={() => setMenuOpen(true)}
            className="xl:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white text-[#2D3748] hover:border-[#FBAD18] transition-colors cursor-pointer"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>

          <Brand />

          {/* Desktop links */}
          <nav
            className="hidden xl:flex items-center gap-1 ml-6 rounded-xl border border-[#CBD5E1] bg-[#EDF0F2] p-1.5"
            aria-label="Main"
          >
            {NAV_LINKS.map(link => {
              const active = isLinkActive(pathname, link);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold tracking-wide transition-colors ${
                    active
                      ? 'bg-[#FBAD18] text-[#2D3748] shadow-sm'
                      : 'text-[#475569] hover:bg-white hover:text-[#2D3748]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#2D3748]' : 'text-[#D97706]'}`} />
                  <span>{link.label}</span>
                  {link.badge && !active && (
                    <span className="rounded-md border border-[#FBAD18]/40 bg-[#FBAD18]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#B45309]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right cluster: Telegram + Cart pinned to the far right edge */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex h-10 items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-3 text-xs font-bold text-[#2D3748] hover:border-[#229ED9] hover:text-[#1B7FB0] transition-colors"
              aria-label="Chat with us on Telegram"
            >
              <TelegramIcon className="w-5 h-5" />
              <span className="hidden 2xl:inline">Telegram</span>
            </a>

            <button
              onClick={openCart}
              className="relative flex h-10 items-center gap-2 rounded-xl bg-[#FBAD18] px-3 text-[#2D3748] shadow-sm hover:bg-[#F59E0B] active:scale-95 transition-all cursor-pointer"
              aria-label={`Open cart, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
            >
              <ShoppingCart className="w-[18px] h-[18px]" />
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0F172A] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu. Rendered outside <header> because backdrop-blur there would trap fixed children. */}
      {menuOpen && (
        <div className="xl:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            className="absolute inset-0 bg-[#0F172A]/55 backdrop-blur-[2px] anim-nav-fade cursor-default"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          />

          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl anim-nav-slide">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#E2E8F0] px-4">
              <span onClick={() => setMenuOpen(false)}>
                <Brand />
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#CBD5E1] text-[#2D3748] cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4" aria-label="Mobile">
              <ul className="space-y-1">
                {NAV_LINKS.map(link => {
                  const active = isLinkActive(pathname, link);
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-semibold transition-colors ${
                          active ? 'bg-[#FBAD18] text-[#2D3748]' : 'text-[#334155] hover:bg-[#EDF0F2]'
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            active ? 'bg-white/60' : 'bg-[#FBAD18]/15'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${active ? 'text-[#2D3748]' : 'text-[#D97706]'}`} />
                        </span>
                        <span className="flex-1">{link.label}</span>
                        {link.badge && (
                          <span className="rounded-md bg-[#10B981]/15 px-2 py-0.5 text-[10px] font-bold text-[#047857]">
                            {link.badge}
                          </span>
                        )}
                        <ChevronRight className={`w-4 h-4 ${active ? 'text-[#2D3748]' : 'text-[#94A3B8]'}`} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="shrink-0 space-y-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                onClick={openCart}
                className="flex w-full items-center justify-between rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm font-semibold text-[#2D3748] hover:border-[#FBAD18] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4 text-[#D97706]" />
                  Your cart
                </span>
                <span className="rounded-md bg-[#FBAD18] px-2.5 py-0.5 text-xs font-bold text-[#2D3748]">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </button>

              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#229ED9] px-4 py-3 text-sm font-bold text-white hover:bg-[#1B8CC2] transition-colors"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <TelegramIcon className="w-6 h-6" />
                </span>
                Chat on Telegram
              </a>
              <p className="text-center text-[11px] font-medium text-[#64748B]">Support online 7 days a week</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
