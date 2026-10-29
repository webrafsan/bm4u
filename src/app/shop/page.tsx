'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Globe, ShoppingBag, X, ArrowUpDown } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS, CATEGORIES, COUNTRIES } from '@/data/products';
import { Product } from '@/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');

  // Dynamically load live products from MongoDB
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setProductsList(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load products from API:', err);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return productsList.filter(p => {
      // Category match
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Country match
      if (selectedCountry !== 'all' && p.country !== selectedCountry) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inCountry = p.country?.toLowerCase().includes(q) || false;
        const inLines = p.lines?.toLowerCase().includes(q) || false;
        const inLimit = p.limit?.toLowerCase().includes(q) || false;
        if (!inTitle && !inCountry && !inLines && !inLimit) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, selectedCountry, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCountry('all');
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-cosmic relative text-[#0F172A]">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 badge-calon text-xs mb-3">
            <ShoppingBag className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Store Catalog</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-3">
            Advertising <span className="text-gradient">Assets & Accounts</span>
          </h1>
          <p className="text-[#475569] text-sm sm:text-base font-normal">
            Verified Business Managers, high-limit BM2500, reinstated profiles, and TikTok ad accounts ready for instant deployment.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="card-glass rounded-2xl p-4 sm:p-5 mb-8 border border-[#CBD5E1] space-y-4 bg-white shadow-xs">
          
          {/* Top row: Search and Selects */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search input */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D97706]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by country, limit, BM3, 3-line reinstated..."
                className="w-full bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl pl-11 pr-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FBAD18] focus:ring-1 focus:ring-[#FBAD18]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Country Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-48">
                <select
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  className="w-full bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm text-[#0F172A] font-semibold focus:outline-none focus:border-[#FBAD18] appearance-none cursor-pointer"
                >
                  <option value="all">All Countries</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <Globe className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D97706] pointer-events-none" />
              </div>

              {/* Price Sort */}
              <div className="relative w-full md:w-44">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="w-full bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm text-[#0F172A] font-semibold focus:outline-none focus:border-[#FBAD18] appearance-none cursor-pointer"
                >
                  <option value="default">Default Sort</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ArrowUpDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D97706] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {CATEGORIES.map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-[#FBAD18] text-[#2D3748] shadow-xs'
                      : 'bg-[#EDF0F2] text-[#475569] border border-[#CBD5E1] hover:border-[#FBAD18] hover:text-[#2D3748]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.2 text-[10px] ${
                      active
                        ? 'bg-[#2D3748]/10 text-[#2D3748] font-bold'
                        : 'bg-white text-[#64748B]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#64748B]">
          <span>
            Showing <strong className="text-[#0F172A] font-bold">{filteredProducts.length}</strong> items
          </span>
          {(searchQuery || selectedCountry !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-[#D97706] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="card-glass rounded-2xl p-12 text-center max-w-md mx-auto my-12 bg-white border border-[#CBD5E1] shadow-xs">
            <ShoppingBag className="w-12 h-12 text-[#FBAD18] mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-[#0F172A] mb-2">No matching products found</h3>
            <p className="text-xs text-[#64748B] mb-6">
              Try adjusting your search criteria, country filter, or category selection.
            </p>
            <button onClick={resetFilters} className="btn-action btn-primary text-xs py-2 px-6 rounded-xl font-bold">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-[#D97706] font-bold">Loading catalog...</div>}>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  );
}
