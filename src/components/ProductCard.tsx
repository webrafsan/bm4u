'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Zap, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart, buyNow } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    buyNow(product, 1);
    router.push(`/checkout?productId=${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, true);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="card-glass rounded-2xl p-5 flex flex-col justify-between relative group overflow-hidden border border-[#E2E8F0] hover:border-[#FBAD18] transition-all duration-300 bg-white">
      {/* Top badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.country && (
            <span className="badge-calon text-[11px] py-0.5 px-2.5">
              {product.country}
            </span>
          )}
          {product.lines && product.lines !== 'n/a' && (
            <span className="text-[11px] font-bold text-[#B45309] bg-[#FFFBEB] border border-[#FBAD18]/40 px-2 py-0.5 rounded-lg">
              {product.lines}
            </span>
          )}
          {product.isSpecial && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D3748] bg-[#FBAD18] px-2 py-0.5 rounded-lg shadow-xs">
              Featured
            </span>
          )}
        </div>

        {/* Stock status indicator */}
        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#10B981]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          <span>{product.stock} in stock</span>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <Link href={`/product/${product.slug}`} className="block group-hover:text-[#D97706] transition-colors">
          <h3 className="font-heading text-base font-bold text-[#0F172A] leading-snug line-clamp-2">
            {product.title}
          </h3>
        </Link>
      </div>

      {/* Feature bullets */}
      <div className="space-y-1.5 mb-5 text-xs text-[#475569]">
        {product.features.slice(0, 3).map((feat, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#D97706] shrink-0 stroke-[2.5]" />
            <span className="truncate">{feat}</span>
          </div>
        ))}
      </div>

      {/* Footer price & actions */}
      <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-4 mt-auto">
        <div className="shrink-0">
          {product.originalPrice && (
            <span className="text-xs text-[#94A3B8] line-through block">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-xl font-extrabold text-[#0F172A] group-hover:text-[#D97706] transition-colors">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#64748B] whitespace-nowrap">/ unit</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Add to Cart quick button */}
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center h-10 w-10 shrink-0 rounded-xl border transition-all duration-200 cursor-pointer shadow-xs ${
              justAdded
                ? 'bg-[#10B981] text-white border-[#10B981]'
                : 'bg-[#EDF0F2] border-[#CBD5E1] text-[#2D3748] hover:bg-[#FBAD18] hover:border-[#FBAD18]'
            }`}
            title="Add to cart"
            aria-label="Add to cart"
          >
            {justAdded ? (
              <Check className="w-4 h-4 animate-scale-in stroke-[2.5]" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>

          {/* Instant Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="btn-action btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 rounded-xl font-semibold whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 shrink-0 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
