'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  KeyRound, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// Base32 Decoder
function base32ToBytes(input: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = input
    .toUpperCase()
    .replace(/[\s-]/g, '')
    .replace(/=+$/g, '');

  if (!clean) throw new Error('Please enter a valid 2FA secret key.');

  let bits = '';
  for (const char of clean) {
    const val = alphabet.indexOf(char);
    if (val === -1) {
      throw new Error(`Invalid Base32 character: "${char}". Secret keys must use A-Z and 2-7.`);
    }
    bits += val.toString(2).padStart(5, '0');
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }

  if (!bytes.length) throw new Error('Invalid secret key length.');
  return new Uint8Array(bytes);
}

// HMAC-SHA1 TOTP generator
async function generateTotp(secret: string): Promise<string> {
  const keyBytes = base32ToBytes(secret);
  const counter = Math.floor(Date.now() / 1000 / 30);

  const counterBytes = new ArrayBuffer(8);
  const view = new DataView(counterBytes);
  const high = Math.floor(counter / 0x100000000);
  const low = counter >>> 0;
  view.setUint32(0, high);
  view.setUint32(4, low);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes as unknown as BufferSource,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, counterBytes);
  const hash = new Uint8Array(signature);
  const offset = hash[hash.length - 1] & 0x0f;

  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  return String(binary % 1000000).padStart(6, '0');
}

// Intelligent multi-format Base32 secret extractor
export function extract2FASecret(input: string): { secret: string; label: string; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { secret: '', label: '', error: 'Empty line' };
  }

  const parts = trimmed.split(/[|:;\t,]/).map(p => p.trim()).filter(Boolean);

  if (parts.length > 1) {
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.includes('@') || part.includes('http') || part.includes('www.') || part.includes('c_user=')) {
        continue;
      }
      const clean = part.toUpperCase().replace(/[\s-]/g, '').replace(/=+$/g, '');
      if (/^[A-Z2-7]{14,64}$/.test(clean)) {
        const label = i === 0 ? `Key #${clean.slice(0, 4)}` : parts[0];
        return { secret: clean, label };
      }
    }
    return {
      secret: '',
      label: parts[0] || 'Unknown',
      error: 'No 2FA secret found in this line',
    };
  }

  const wholeClean = trimmed.toUpperCase().replace(/[\s-]/g, '').replace(/=+$/g, '');
  if (/^[A-Z2-7]{14,64}$/.test(wholeClean)) {
    return { secret: wholeClean, label: wholeClean.slice(0, 8) + '...' };
  }

  const match = trimmed.replace(/[\s-]/g, '').match(/[A-Za-z2-7]{14,64}/);
  if (match) {
    return { secret: match[0].toUpperCase(), label: 'Secret Key' };
  }

  return {
    secret: wholeClean,
    label: trimmed.slice(0, 16),
    error: 'Invalid 2FA secret key format',
  };
}

interface BulkItemResult {
  original: string;
  label: string;
  secret: string;
  code: string;
  error?: string;
}

export default function FB2FAPage() {
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('------');
  const [error, setError] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [bulkInput, setBulkInput] = useState('');
  const [bulkResults, setBulkResults] = useState<BulkItemResult[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAllCodes, setCopiedAllCodes] = useState(false);
  const [copiedAllWithLines, setCopiedAllWithLines] = useState(false);

  const updateTimer = useCallback(() => {
    const epochSeconds = Math.floor(Date.now() / 1000);
    const remaining = 30 - (epochSeconds % 30);
    setSecondsRemaining(remaining);
  }, []);

  const runGenerate = useCallback(async () => {
    if (!secret.trim()) {
      setCode('------');
      setError(null);
      return;
    }

    try {
      setError(null);
      const extracted = extract2FASecret(secret);
      if (extracted.error && !/^[A-Z2-7]{14,64}$/.test(extracted.secret)) {
        throw new Error(extracted.error);
      }
      const res = await generateTotp(extracted.secret);
      setCode(res);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Unable to generate code.');
      setCode('------');
    }
  }, [secret]);

  const runBulkGenerate = useCallback(async (customInput?: string) => {
    const textToProcess = customInput !== undefined ? customInput : bulkInput;
    const lines = textToProcess
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    if (!lines.length) {
      setBulkResults([]);
      return;
    }

    const results = await Promise.all(
      lines.map(async line => {
        const extracted = extract2FASecret(line);
        if (extracted.error || !extracted.secret) {
          return {
            original: line,
            label: extracted.label,
            secret: extracted.secret,
            code: 'INVALID',
            error: extracted.error || 'Invalid 2FA Secret Key',
          };
        }

        try {
          const res = await generateTotp(extracted.secret);
          return {
            original: line,
            label: extracted.label,
            secret: extracted.secret,
            code: res,
          };
        } catch (e: unknown) {
          const err = e as Error;
          return {
            original: line,
            label: extracted.label,
            secret: extracted.secret,
            code: 'INVALID',
            error: err.message || 'Invalid key length/format',
          };
        }
      })
    );

    setBulkResults(results);
  }, [bulkInput]);

  useEffect(() => {
    updateTimer();
    const interval = setInterval(() => {
      updateTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  useEffect(() => {
    if (secondsRemaining === 30) {
      if (mode === 'single' && secret.trim()) {
        runGenerate();
      } else if (mode === 'bulk' && bulkInput.trim()) {
        runBulkGenerate();
      }
    }
  }, [secondsRemaining, mode, secret, bulkInput, runGenerate, runBulkGenerate]);

  useEffect(() => {
    if (mode === 'single') {
      runGenerate();
    }
  }, [secret, mode, runGenerate]);

  const handleBulkInputChange = (value: string) => {
    setBulkInput(value);
    runBulkGenerate(value);
  };

  const copyToClipboard = async (textToCopy: string) => {
    if (!textToCopy || textToCopy === '------' || textToCopy === 'INVALID') return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
    }
  };

  const copyBulkRow = async (idx: number, itemCode: string) => {
    if (!itemCode || itemCode === 'INVALID') return;
    try {
      await navigator.clipboard.writeText(itemCode);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      // fallback
    }
  };

  const copyAllCodes = async () => {
    const validCodes = bulkResults
      .filter(r => r.code !== 'INVALID')
      .map(r => r.code)
      .join('\n');
    if (!validCodes) return;
    try {
      await navigator.clipboard.writeText(validCodes);
      setCopiedAllCodes(true);
      setTimeout(() => setCopiedAllCodes(false), 1500);
    } catch {
      // fallback
    }
  };

  const copyAllWithLines = async () => {
    const formatted = bulkResults
      .map(r => `${r.label || r.secret} | ${r.code}`)
      .join('\n');
    if (!formatted) return;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedAllWithLines(true);
      setTimeout(() => setCopiedAllWithLines(false), 1500);
    } catch {
      // fallback
    }
  };

  const clearBulk = () => {
    setBulkInput('');
    setBulkResults([]);
  };

  const validCount = bulkResults.filter(r => r.code !== 'INVALID').length;
  const invalidCount = bulkResults.filter(r => r.code === 'INVALID').length;

  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
      <Navbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <div className="mx-auto max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 badge-calon text-xs mb-4">
              <KeyRound className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Facebook 2FA Authenticator</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4">
              Instant <span className="text-gradient">2FA Code</span> Generator
            </h1>
            <p className="text-[#475569] text-base max-w-xl mx-auto font-normal">
              Generate 6-digit authentication codes for your Facebook accounts, Business Managers, and ad assets directly in your browser with zero latency.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-xl bg-white border border-[#CBD5E1] shadow-xs">
              <button
                onClick={() => setMode('single')}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  mode === 'single'
                    ? 'bg-[#FBAD18] text-[#0F172A] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Single Key
              </button>
              <button
                onClick={() => {
                  setMode('bulk');
                  if (bulkInput.trim() && bulkResults.length === 0) {
                    runBulkGenerate(bulkInput);
                  }
                }}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  mode === 'bulk'
                    ? 'bg-[#FBAD18] text-[#0F172A] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Bulk / Multi 2FA Mode
              </button>
            </div>
          </div>

          {/* SINGLE MODE */}
          {mode === 'single' && (
            <div className="card-glass rounded-3xl p-6 sm:p-10 border border-[#CBD5E1] shadow-md bg-white">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
                    2FA Secret Key or Account String (Base32)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={secret}
                      onChange={e => setSecret(e.target.value)}
                      placeholder="e.g. JBSWY3DPEHPK3PXP or 100083921|Pass|JBSWY3DPEHPK3PXP"
                      className="w-full bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl px-5 py-4 text-[#0F172A] text-base font-mono placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FBAD18] focus:ring-2 focus:ring-[#FBAD18]/20 transition-all font-semibold"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-2 font-medium">
                    Accepts standalone Base32 keys or pasted account strings like <code>UID|Pass|2FA_Secret|...</code>
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#F87171] text-[#991B1B] text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* 6-Digit Code Display */}
                <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#EDF0F2] p-6 rounded-2xl border border-[#CBD5E1]">
                  <div className="flex items-center gap-6">
                    {/* Circular Timer */}
                    <div className="relative flex items-center justify-center h-16 w-16">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="rgba(203, 213, 225, 0.8)"
                          strokeWidth="4"
                          fill="none"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke={secondsRemaining <= 5 ? '#EF4444' : '#FBAD18'}
                          strokeWidth="4"
                          strokeDasharray={163.3}
                          strokeDashoffset={163.3 * (1 - secondsRemaining / 30)}
                          strokeLinecap="round"
                          fill="none"
                          className="transition-all duration-1000 ease-linear"
                        />
                      </svg>
                      <span className="absolute text-xs font-mono font-black text-[#0F172A]">
                        {secondsRemaining}s
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#64748B] font-bold block mb-1">
                        One-Time Passcode
                      </span>
                      <div className="font-heading text-4xl sm:text-5xl font-extrabold tracking-widest text-[#0F172A] font-mono select-all">
                        {code}
                      </div>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(code)}
                    disabled={code === '------'}
                    className={`btn-action ${
                      copied ? 'bg-[#10B981] text-white' : 'btn-primary'
                    } py-3.5 px-8 text-sm font-bold flex items-center gap-2 w-full sm:w-auto justify-center rounded-xl disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BULK MODE */}
          {mode === 'bulk' && (
            <div className="card-glass rounded-3xl p-6 sm:p-10 border border-[#CBD5E1] shadow-md bg-white">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                      Paste Multiple Keys or Account Lines (One Per Line)
                    </label>
                    <span className="text-[11px] font-mono text-[#D97706] font-bold">
                      Auto-detects keys & formats
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={bulkInput}
                    onChange={e => handleBulkInputChange(e.target.value)}
                    placeholder={`JBSWY3DPEHPK3PXP\n100083921049281|Password123|JBSWY3DPEHPK3PXP|mail@gmail.com\n4NR76VOPCBRT7F3T\n100091284729102:Pass@123:HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ`}
                    className="w-full bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl p-4 text-[#0F172A] text-xs font-mono placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FBAD18] focus:ring-2 focus:ring-[#FBAD18]/20 transition-all leading-relaxed font-semibold"
                  />
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3">
                    <p className="text-[11px] text-[#64748B] font-medium">
                      Supports pure 2FA keys, separated with <code>|</code>, <code>:</code>, tabs, or spaces.
                    </p>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => runBulkGenerate()}
                        disabled={!bulkInput.trim()}
                        className="btn-action btn-primary py-2.5 px-5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 flex-1 sm:flex-initial disabled:opacity-40"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Generate 2FA Codes</span>
                      </button>
                      {bulkInput.trim() && (
                        <button
                          onClick={clearBulk}
                          className="btn-action btn-ghost py-2.5 px-3.5 text-xs rounded-xl text-[#DC2626] border-[#FCA5A5] flex items-center gap-1.5"
                          title="Clear input"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {bulkResults.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-[#E2E8F0]">
                    {/* Bulk Stats & Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#EDF0F2] p-4 rounded-2xl border border-[#CBD5E1]">
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <span className="text-[#64748B]">
                          Total: <strong className="text-[#0F172A] font-mono font-bold">{bulkResults.length}</strong>
                        </span>
                        <span className="text-[#10B981] font-bold flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active: {validCount}
                        </span>
                        {invalidCount > 0 && (
                          <span className="text-[#EF4444] font-bold flex items-center gap-1 font-mono">
                            <AlertCircle className="w-3.5 h-3.5" /> Invalid: {invalidCount}
                          </span>
                        )}
                        <span className="text-[#0F172A] font-mono flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#CBD5E1]">
                          <span className="inline-block w-2 h-2 rounded-full bg-[#FBAD18] animate-pulse" />
                          Next code in: <strong>{secondsRemaining}s</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {validCount > 0 && (
                          <>
                            <button
                              onClick={copyAllCodes}
                              className="btn-action btn-ghost text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 font-bold"
                              title="Copy all 6-digit codes line by line"
                            >
                              {copiedAllCodes ? (
                                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-[#D97706]" />
                              )}
                              <span>{copiedAllCodes ? 'Codes Copied!' : 'Copy Codes'}</span>
                            </button>
                            <button
                              onClick={copyAllWithLines}
                              className="btn-action btn-ghost text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 font-bold"
                              title="Copy account identifiers and codes"
                            >
                              {copiedAllWithLines ? (
                                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                              ) : (
                                <FileText className="w-3.5 h-3.5 text-[#D97706]" />
                              )}
                              <span>{copiedAllWithLines ? 'Exported!' : 'Copy with ID'}</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Results Table */}
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                      {bulkResults.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                            item.code === 'INVALID'
                              ? 'bg-[#FEE2E2]/30 border-[#FCA5A5]'
                              : 'bg-white border-[#CBD5E1] hover:border-[#FBAD18]'
                          }`}
                        >
                          <div className="min-w-0 pr-3 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#0F172A] truncate max-w-[160px] sm:max-w-xs block">
                                {item.label || item.secret}
                              </span>
                              {item.code === 'INVALID' && (
                                <span className="bg-[#FEE2E2] text-[#991B1B] text-[10px] font-bold px-2 py-0.5 rounded border border-[#F87171] uppercase">
                                  Invalid Key
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[11px] text-[#64748B] truncate max-w-[200px] sm:max-w-md block mt-0.5">
                              {item.error ? item.error : `Key: ${item.secret}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {item.code !== 'INVALID' ? (
                              <>
                                <span className="font-mono font-black text-xl sm:text-2xl text-[#0F172A] tracking-widest select-all">
                                  {item.code}
                                </span>
                                <button
                                  onClick={() => copyBulkRow(idx, item.code)}
                                  className="p-2 rounded-lg bg-[#EDF0F2] border border-[#CBD5E1] hover:bg-[#FBAD18] text-[#0F172A] transition-all cursor-pointer"
                                  title="Copy code"
                                >
                                  {copiedIdx === idx ? (
                                    <Check className="w-4 h-4 text-[#10B981]" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </>
                            ) : (
                              <span className="text-xs font-mono text-[#DC2626] px-3 py-1 rounded bg-[#FEE2E2]">
                                Failed
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security & Guarantee note */}
          <div className="mt-10 p-6 rounded-2xl bg-white border border-[#CBD5E1] flex items-start gap-4 text-xs text-[#475569] shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#0F172A] mb-1">100% Client-Side Cryptographic Security</h4>
              <p className="leading-relaxed">
                All 2FA calculations occur locally in your browser using standard Web Crypto SHA-1 HMAC algorithms. Your private authentication keys are never sent to our servers or stored in any database.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
