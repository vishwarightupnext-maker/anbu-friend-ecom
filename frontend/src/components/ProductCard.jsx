import React from 'react';
import { ShoppingBag, Eye, Sparkles, Check, FileCheck, BookOpen, Mail, ArrowRight } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct, onBuyNow, onAddToCart, isPurchased }) {
  const isPdf = product.fileType === 'pdf' || (product.pdfUrl && product.pdfUrl.includes('.pdf')) || product.unit?.includes('PDF');

  return (
    <div className="group relative bg-white border border-zinc-200/90 rounded-3xl p-4 transition-all duration-300 hover:shadow-xl hover:border-zinc-400 flex flex-col justify-between">
      
      {/* Top Image / Book Cover Preview */}
      <div 
        onClick={() => onSelectProduct(product)}
        className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 flex items-center justify-center cursor-pointer group-hover:bg-zinc-100/70 transition-colors"
      >
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:12px_12px]" />
        
        <img
          src={product.image || product.pngUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="relative z-10 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = isPdf 
              ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
              : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Floating Format Badges */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 items-start">
          {isPdf ? (
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase bg-amber-500 text-zinc-950 rounded-lg shadow-xs flex items-center gap-1">
              <BookOpen className="h-3 w-3" /> PDF E-BOOK
            </span>
          ) : (
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase bg-[#0d382c] text-white rounded-lg shadow-xs">
              PNG 4K
            </span>
          )}

          <span className="px-2 py-0.5 text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-zinc-700 rounded-md border border-zinc-200">
            {isPdf ? (product.pages || 'PDF Manuscript') : (product.resolution ? product.resolution.split(' ')[0] : '3840x3840')}
          </span>
        </div>

        {/* Quick View Hover overlay */}
        <div className="absolute inset-0 z-20 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="px-4 py-2 bg-white text-zinc-950 font-extrabold text-xs rounded-full shadow-lg hover:bg-zinc-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-amber-600" /> Preview Details
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium">
            <span>{product.categoryName || (isPdf ? 'E-Book PDF' : 'Digital PNG')}</span>
            <span>{product.fileSize || '8 MB'}</span>
          </div>

          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-bold text-sm text-zinc-900 group-hover:text-emerald-950 transition-colors line-clamp-1 cursor-pointer mt-0.5"
          >
            {product.name}
          </h3>

          <p className="text-xs text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 mt-2 border-t border-zinc-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-zinc-900">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-zinc-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Mail className="h-3 w-3" /> Email Delivery Only
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isPurchased ? (
              <button
                onClick={() => onSelectProduct(product)}
                className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileCheck className="h-3.5 w-3.5 text-emerald-700" /> Emailed Link
              </button>
            ) : (
              <>
                <button
                  onClick={() => onAddToCart(product)}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200/90 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <ShoppingBag className="h-3.5 w-3.5 text-amber-600" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => onBuyNow(product)}
                  className="py-2 px-3.5 rounded-xl text-xs font-black bg-[#0d382c] hover:bg-[#07241c] text-white shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <span>Buy</span>
                  <ArrowRight className="h-3 w-3 text-amber-400" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
