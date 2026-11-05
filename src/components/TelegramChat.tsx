'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { TelegramIcon } from '@/components/icons/TelegramIcon';

const TELEGRAM_URL = 'https://t.me/bybm4u';
const SEEN_KEY = 'bm4u_tg_greeted';

// Floating support widget in the bottom-right corner. It greets once per session after a few
// seconds with a small chat-style card; the button re-opens it any time.
export function TelegramChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);

  const hidden = pathname.startsWith('/admin');

  // Opening always replays the short "typing..." moment before the message appears.
  const openChat = useCallback(() => {
    setOpen(true);
    setTyping(true);
    setTimeout(() => setTyping(false), 1100);
  }, []);

  useEffect(() => {
    if (hidden) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // storage unavailable: just greet
    }
    if (seen) return;
    const timer = setTimeout(() => {
      openChat();
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        // ignore
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [hidden, openChat]);

  if (hidden) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)]">
      {open && (
        <div
          className="w-[300px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl anim-tg-pop"
          role="dialog"
          aria-label="Chat with support on Telegram"
        >
          <div className="flex items-center gap-3 bg-[#229ED9] px-4 py-3 text-white">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
              <TelegramIcon className="w-9 h-9" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#229ED9] bg-[#22C55E]" />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-sm font-bold">BM 4 U Support</span>
              <span className="block text-[11px] text-white/85">Online - replies on Telegram</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="min-h-[96px] bg-[#EAF3F8] px-4 py-4">
            {typing ? (
              <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm" aria-label="Typing">
                <span className="tg-dot h-1.5 w-1.5 rounded-full bg-[#94A3B8]" />
                <span className="tg-dot h-1.5 w-1.5 rounded-full bg-[#94A3B8] [animation-delay:150ms]" />
                <span className="tg-dot h-1.5 w-1.5 rounded-full bg-[#94A3B8] [animation-delay:300ms]" />
              </div>
            ) : (
              <p className="inline-block max-w-[92%] rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-[13px] leading-relaxed text-[#1E293B] shadow-sm anim-tg-bubble">
                Hi! Need help choosing a Business Manager or tracking an order? Message us on Telegram, we reply 7 days a week.
              </p>
            )}
          </div>

          <div className="bg-white p-3">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1B8CC2] transition-colors"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <TelegramIcon className="w-5 h-5" />
              </span>
              Start chat on Telegram
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => (open ? setOpen(false) : openChat())}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-black/5 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        aria-label={open ? 'Close Telegram chat' : 'Chat with us on Telegram'}
        aria-expanded={open}
      >
        {!open && <span className="absolute inset-0 rounded-full bg-[#229ED9]/35 anim-tg-ring pointer-events-none" />}
        <TelegramIcon className="relative w-11 h-11" />
        {!open && <span className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#22C55E]" />}
      </button>
    </div>
  );
}
