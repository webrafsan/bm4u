'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UserCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck,
  RotateCcw,
  Play
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { UIDCheckResult } from '@/types';

export function extractUID(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  const urlIdMatch = trimmed.match(/[?&]id=(\d{4,25})/);
  if (urlIdMatch) return urlIdMatch[1];

  const pathIdMatch = trimmed.match(/facebook\.com\/(\d{4,25})/);
  if (pathIdMatch) return pathIdMatch[1];

  const parts = trimmed.split(/[|:;\t,]/).map(p => p.trim()).filter(Boolean);
  for (const part of parts) {
    const digitsOnly = part.replace(/\D/g, '');
    if (digitsOnly.length >= 4 && digitsOnly.length <= 25 && /^\d+$/.test(part)) {
      return digitsOnly;
    }
  }

  const longDigits = trimmed.match(/\b\d{10,20}\b/);
  if (longDigits) return longDigits[0];

  const anyDigits = trimmed.match(/\d{4,25}/);
  if (anyDigits) return anyDigits[0];

  return '';
}

export default function LiveUIDCheckerPage() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [singleUid, setSingleUid] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UIDCheckResult[]>([]);
  const [copiedLive, setCopiedLive] = useState(false);
  const [copiedDie, setCopiedDie] = useState(false);
  const [copiedRowIdx, setCopiedRowIdx] = useState<number | null>(null);
  const [progressText, setProgressText] = useState('');

  const handleSingleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = extractUID(singleUid);
    if (!clean) return;

    setLoading(true);
    setResults([
      {
        uid: clean,
        status: 'CHECKING',
        message: 'Querying Meta Graph servers...',
      },
    ]);

    try {
      const res = await fetch('/api/check-uid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: clean }),
      });
      const json = await res.json();
      if (json.success) {
        setResults([
          {
            uid: clean,
            status: json.data.status,
            avatar: json.data.avatar,
            message: json.data.message,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        setResults([
          {
            uid: clean,
            status: 'UNKNOWN',
            message: json.message || 'Unable to complete check',
          },
        ]);
      }
    } catch {
      setResults([
        {
          uid: clean,
          status: 'UNKNOWN',
          message: 'Connection error during verification.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCheck = async () => {
    const rawLines = bulkInput
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    const extractedUids = rawLines
      .map(line => extractUID(line))
      .filter(u => u.length >= 4);

    const uids = Array.from(new Set(extractedUids));

    if (!uids.length) return;

    setLoading(true);
    setProgressText(`Checking 0 of ${uids.length}...`);

    const initial: UIDCheckResult[] = uids.map(u => ({
      uid: u,
      status: 'CHECKING',
      message: 'Pending check...',
    }));
    setResults(initial);

    const batchSize = 5;
    const finalResults: UIDCheckResult[] = [];

    for (let i = 0; i < uids.length; i += batchSize) {
      const currentBatch = uids.slice(i, i + batchSize);
      setProgressText(`Checking ${Math.min(i + batchSize, uids.length)} of ${uids.length}...`);

      const batchResults = await Promise.all(
        currentBatch.map(async u => {
          try {
            const res = await fetch('/api/check-uid', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ uid: u }),
            });
            const json = await res.json();
            if (json.success) {
              return {
                uid: u,
                status: json.data.status as 'LIVE' | 'DIE' | 'UNKNOWN',
                avatar: json.data.avatar,
                message: json.data.message,
                time: new Date().toLocaleTimeString(),
              };
            }
            return {
              uid: u,
              status: 'UNKNOWN' as const,
              message: json.message || 'Check failed',
            };
          } catch {
            return {
              uid: u,
              status: 'UNKNOWN' as const,
              message: 'Network error',
            };
          }
        })
      );

      finalResults.push(...batchResults);
      const remaining = initial.slice(finalResults.length);
      setResults([...finalResults, ...remaining]);
    }

    setResults(finalResults);
    setProgressText('');
    setLoading(false);
  };

  const liveCount = results.filter(r => r.status === 'LIVE').length;
  const dieCount = results.filter(r => r.status === 'DIE').length;

  const copyLiveUids = async () => {
    const liveList = results
      .filter(r => r.status === 'LIVE')
      .map(r => r.uid)
      .join('\n');
    if (!liveList) return;

    try {
      await navigator.clipboard.writeText(liveList);
      setCopiedLive(true);
      setTimeout(() => setCopiedLive(false), 1500);
    } catch {
      // fallback
    }
  };

  const copyDieUids = async () => {
    const dieList = results
      .filter(r => r.status === 'DIE')
      .map(r => r.uid)
      .join('\n');
    if (!dieList) return;

    try {
      await navigator.clipboard.writeText(dieList);
      setCopiedDie(true);
      setTimeout(() => setCopiedDie(false), 1500);
    } catch {
      // fallback
    }
  };

  const copySingleRow = async (idx: number, uid: string) => {
    try {
      await navigator.clipboard.writeText(uid);
      setCopiedRowIdx(idx);
      setTimeout(() => setCopiedRowIdx(null), 1500);
    } catch {
      // fallback
    }
  };

  const clearBulk = () => {
    setBulkInput('');
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
      <Navbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <div className="mx-auto max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 badge-calon text-xs mb-4">
              <UserCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Facebook Account Verification</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4">
              Live Facebook <span className="text-gradient">UID Checker</span>
            </h1>
            <p className="text-[#475569] text-base max-w-xl mx-auto font-normal">
              Verify if Facebook profiles and administrative user IDs are active (LIVE) or restricted (DIE) before importing them into your ad setups.
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
                Single UID
              </button>
              <button
                onClick={() => setMode('bulk')}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  mode === 'bulk'
                    ? 'bg-[#FBAD18] text-[#0F172A] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Bulk UID Checker
              </button>
            </div>
          </div>

          {/* SINGLE MODE */}
          {mode === 'single' && (
            <div className="card-glass rounded-3xl p-6 sm:p-10 border border-[#CBD5E1] shadow-md bg-white">
              <form onSubmit={handleSingleCheck} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
                    Enter Facebook Numeric UID or Profile URL
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={singleUid}
                      onChange={e => setSingleUid(e.target.value)}
                      placeholder="e.g. 100083921049281 or https://facebook.com/100083921049281"
                      className="flex-1 bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl px-5 py-4 text-[#0F172A] text-base font-mono placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FBAD18] focus:ring-2 focus:ring-[#FBAD18]/20 transition-all font-semibold"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      disabled={loading || !singleUid.trim()}
                      className="btn-action btn-primary py-4 px-8 text-sm font-bold flex items-center justify-center gap-2 rounded-xl disabled:opacity-40"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Checking...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>Check Live UID</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-2 font-medium">
                    Supports standalone numeric IDs, Facebook URLs, or account credential strings.
                  </p>
                </div>
              </form>

              {/* Single Result Display */}
              {results.length > 0 && results[0] && (
                <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
                  <div
                    className={`p-6 rounded-2xl border transition-all ${
                      results[0].status === 'LIVE'
                        ? 'bg-[#ECFDF5] border-[#10B981]/40 shadow-xs'
                        : results[0].status === 'DIE'
                        ? 'bg-[#FEE2E2] border-[#F87171]/40 shadow-xs'
                        : 'bg-[#EDF0F2] border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {results[0].status === 'LIVE' ? (
                          <div className="h-12 w-12 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981] shrink-0">
                            <CheckCircle2 className="w-7 h-7" />
                          </div>
                        ) : results[0].status === 'DIE' ? (
                          <div className="h-12 w-12 rounded-full bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444] shrink-0">
                            <XCircle className="w-7 h-7" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-[#FBAD18] shrink-0">
                            <RefreshCw className="w-6 h-6 animate-spin" />
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-lg font-bold text-[#0F172A] font-mono">
                              {results[0].uid}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                                results[0].status === 'LIVE'
                                  ? 'bg-[#10B981] text-white'
                                  : results[0].status === 'DIE'
                                  ? 'bg-[#EF4444] text-white'
                                  : 'bg-slate-300 text-[#0F172A]'
                              }`}
                            >
                              {results[0].status}
                            </span>
                          </div>
                          <p className="text-xs text-[#475569] mt-0.5 font-medium">
                            {results[0].message}
                          </p>
                        </div>
                      </div>

                      {results[0].avatar && (
                        <div className="h-12 w-12 rounded-full overflow-hidden border border-[#CBD5E1] bg-white shrink-0 shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={results[0].avatar}
                            alt="Facebook Profile Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BULK MODE */}
          {mode === 'bulk' && (
            <div className="card-glass rounded-3xl p-6 sm:p-10 border border-[#CBD5E1] shadow-md bg-white">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                      Paste Multiple Facebook UIDs or Account Strings (One per line)
                    </label>
                    <span className="text-[11px] font-mono text-[#D97706] font-bold">
                      Auto-extracts numeric UID
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={bulkInput}
                    onChange={e => setBulkInput(e.target.value)}
                    placeholder={`100083921049281\n100072619401284|Password|2FA|Mail...\nhttps://facebook.com/100091827461942\n100062719284712:Pass123`}
                    className="w-full bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl p-4 text-[#0F172A] text-xs font-mono placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FBAD18] focus:ring-2 focus:ring-[#FBAD18]/20 transition-all leading-relaxed font-semibold"
                  />
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3">
                    <p className="text-[11px] text-[#64748B] font-medium">
                      Extracts numeric UID automatically even from account formats or profile URLs.
                    </p>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleBulkCheck}
                        disabled={loading || !bulkInput.trim()}
                        className="btn-action btn-primary py-3 px-6 text-xs font-bold rounded-xl flex items-center justify-center gap-2 flex-1 sm:flex-initial disabled:opacity-40"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>{progressText || 'Verifying...'}</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Run Bulk Verification</span>
                          </>
                        )}
                      </button>
                      {bulkInput.trim() && (
                        <button
                          onClick={clearBulk}
                          disabled={loading}
                          className="btn-action btn-ghost py-3 px-3.5 text-xs rounded-xl text-[#DC2626] border-[#FCA5A5] flex items-center gap-1.5"
                          title="Clear input"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bulk Results Summary */}
                {results.length > 0 && (
                  <div className="pt-6 border-t border-[#E2E8F0] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#EDF0F2] p-4 rounded-xl border border-[#CBD5E1]">
                      <div className="flex items-center gap-4 text-xs font-mono font-bold">
                        <span className="text-[#64748B]">
                          Total: <strong className="text-[#0F172A]">{results.length}</strong>
                        </span>
                        <span className="text-[#10B981] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Live: {liveCount}
                        </span>
                        <span className="text-[#EF4444] flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Die: {dieCount}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {liveCount > 0 && (
                          <button
                            onClick={copyLiveUids}
                            className="btn-action btn-ghost text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 font-bold"
                          >
                            {copiedLive ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#D97706]" />}
                            <span>{copiedLive ? 'Copied Live!' : 'Copy Live UIDs'}</span>
                          </button>
                        )}
                        {dieCount > 0 && (
                          <button
                            onClick={copyDieUids}
                            className="btn-action btn-ghost text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 text-[#DC2626] font-bold border-[#FCA5A5]"
                          >
                            {copiedDie ? <Check className="w-3.5 h-3.5 text-[#DC2626]" /> : <Copy className="w-3.5 h-3.5 text-[#DC2626]" />}
                            <span>{copiedDie ? 'Copied Die!' : 'Copy Die UIDs'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Result Table */}
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                      {results.map((r, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all ${
                            r.status === 'LIVE'
                              ? 'bg-[#ECFDF5] border-[#10B981]/30 text-[#0F172A]'
                              : r.status === 'DIE'
                              ? 'bg-[#FEE2E2]/40 border-[#FCA5A5] text-[#475569]'
                              : 'bg-white border-[#CBD5E1] text-[#475569]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#0F172A] select-all">{r.uid}</span>
                            <button
                              onClick={() => copySingleRow(idx, r.uid)}
                              className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded transition-colors cursor-pointer"
                              title="Copy UID"
                            >
                              {copiedRowIdx === idx ? (
                                <Check className="w-3 h-3 text-[#10B981]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-[#64748B] hidden sm:inline font-medium">
                              {r.message}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                                r.status === 'LIVE'
                                  ? 'bg-[#10B981] text-white'
                                  : r.status === 'DIE'
                                  ? 'bg-[#EF4444] text-white'
                                  : 'bg-slate-300 text-[#0F172A]'
                              }`}
                            >
                              {r.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warranty reminder */}
          <div className="mt-10 p-6 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              <div className="text-xs text-[#475569]">
                <h4 className="font-bold text-[#0F172A] mb-0.5">24-Hour Replacement Rule</h4>
                <p>
                  Always verify purchased account UIDs with this checker prior to first login. If a UID is inactive (DIE) upon delivery, you are eligible for an immediate replacement under our policy.
                </p>
              </div>
            </div>
            <Link
              href="/replace-rules"
              className="btn-action btn-ghost text-xs py-2 px-3.5 rounded-xl shrink-0 hidden sm:inline-flex font-bold"
            >
              Read Rules
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
