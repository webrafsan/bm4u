'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Send, 
  Award, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AboutUsPage() {
  const pillars = [
    {
      title: 'Carefully Selected & Reviewed',
      desc: 'Every Business Manager and reinstated Facebook profile is tested for live ad permissions and verified credentials before being listed.',
      icon: CheckCircle2,
    },
    {
      title: '2+ Years Industry Experience',
      desc: 'Extensive hands-on background in performance affiliate marketing and media buying allows us to understand real advertiser bottlenecks.',
      icon: Award,
    },
    {
      title: 'Fair & Direct Pricing',
      desc: 'We eliminate unnecessary broker markups to provide competitive tier-1 assets directly to performance marketing teams.',
      icon: Zap,
    },
    {
      title: 'Responsive 1-on-1 Support',
      desc: 'Our dedicated Telegram support desk is active 7 days a week to assist with order fulfillment, replacement inquiries, and advice.',
      icon: Send,
    },
  ];

  const whoWeServe = [
    'Performance Marketing Agencies',
    'Media Buyers & Traffic Arbitrageurs',
    'E-Commerce & DTC Brands',
    'Social Media Growth Managers',
    'Affiliate Advertisers',
    'Meta & TikTok Media Teams',
  ];

  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <div className="mx-auto max-w-4xl space-y-16">
          
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 badge-calon text-xs mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>About BM 4 U</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Empowering Advertisers <br className="hidden sm:inline" />
              With <span className="text-gradient">Reliable Ad Infrastructure</span>
            </h1>
            <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
              We supply high-trust Facebook Business Managers, verified advertising accounts, and digital marketing assets for agencies, media buyers, and scaling businesses worldwide.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-4">
            <span className="badge-calon text-xs py-0.5 px-3">Our Core Mission</span>
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              Eliminating Advertising Roadblocks
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              In modern performance marketing, sudden spending limits and unprovoked algorithm restrictions can paralyze a profitable campaign overnight. Our mission is to make high-authority advertising resources accessible, transparent, and resilient so advertisers can focus on scaling ROI rather than battling asset bans.
            </p>
          </div>

          {/* What Sets Us Apart 4-Grid */}
          <div>
            <div className="text-center mb-8">
              <h3 className="font-heading text-2xl font-bold text-slate-900">
                What Sets BM4U Apart
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading text-base font-bold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Who We Serve */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-heading text-xl font-bold text-slate-900">
              Who We Serve
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {whoWeServe.map((client, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{client}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-amber-50/40 border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Ready to Upgrade Your Advertising Workflow?
              </h3>
              <p className="text-xs text-slate-600">
                Explore our catalog or message our team directly for custom agency bundles.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/shop" className="btn-action btn-primary text-xs py-3 px-6 rounded-xl font-bold shadow-sm">
                Explore Store
              </Link>
              <a
                href="https://t.me/bybm4u"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs py-3 px-4 rounded-xl flex items-center gap-2 font-semibold shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-blue-500" />
                <span>Telegram Support</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
