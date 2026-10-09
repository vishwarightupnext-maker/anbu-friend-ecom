import React from 'react';
import { X, Download, ShieldCheck, Check, Sparkles, BookOpen, ExternalLink, FileCheck, Mail, ShoppingBag, ArrowRight } from 'lucide-react';
import { getDownloadUrl } from '../api';

export default function ProductDetailModal({ product, onClose, onBuyNow, onAddToCart, isPurchased }) {
  if (!product) return null;

  const isPdf = product.fileType === 'pdf' || (product.pdfUrl && product.pdfUrl.includes('.pdf')) || product.unit?.includes('PDF');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 overflow-hidden">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-zinc-900 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Left: Asset / Cover Preview */}
          <div className="relative aspect-square w-full rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center p-4 overflow-hidden group">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:12px_12px]" />
            <img
              src={product.image || product.pngUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              className="relative z-10 max-h-72 object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = isPdf 
                  ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
                  : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <span className="absolute bottom-3 left-3 z-10 px-2.5 py-1 text-[10px] font-bold uppercase bg-zinc-900/90 text-white rounded-md backdrop-blur-xs flex items-center gap-1">
              {isPdf ? <BookOpen className="h-3 w-3 text-amber-400" /> : null}
              {isPdf ? 'PDF E-BOOK PREVIEW' : 'PNG TRANSPARENT PREVIEW'}
            </span>
          </div>

          {/* Right: Details */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-md border ${
                  isPdf 
                    ? 'bg-amber-50 text-amber-900 border-amber-200' 
                    : 'bg-zinc-100 text-zinc-800 border-zinc-200'
                }`}>
                  {isPdf ? 'PDF E-BOOK' : 'Digital PNG'}
                </span>
                <span className="text-xs text-zinc-500 font-medium">Digital Product</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-2">{product.name}</h2>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                {product.description || 'Authentic digital product asset. Download link sent to your email upon checkout.'}
              </p>
            </div>

            {/* Specifications Box */}
            <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200/70 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-200/50">
                <span className="text-zinc-500">File Format:</span>
                <span className="font-semibold text-zinc-900">{isPdf ? 'Portable Document (.PDF)' : 'Lossless PNG (.png)'}</span>
              </div>
              {isPdf ? (
                <>
                  <div className="flex justify-between py-1 border-b border-zinc-200/50">
                    <span className="text-zinc-500">Length:</span>
                    <span className="font-semibold text-zinc-900">{product.pages || '148 Pages'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200/50">
                    <span className="text-zinc-500">Author:</span>
                    <span className="font-semibold text-zinc-900">{product.author || 'Clyrova Research'}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between py-1 border-b border-zinc-200/50">
                  <span className="text-zinc-500">Resolution:</span>
                  <span className="font-semibold text-zinc-900">{product.resolution || '3840 x 3840 px (300 DPI)'}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-zinc-200/50">
                <span className="text-zinc-500">Delivery Method:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> Cloudinary Link Sent to Email Only
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">License:</span>
                <span className="font-semibold text-zinc-900">Personal & Commercial Rights</span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-2 border-t border-zinc-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block font-semibold">Store Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-zinc-900">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-zinc-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>

                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> Email Delivery
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onAddToCart(product);
                  }}
                  className="flex-1 py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-2xl font-extrabold text-xs border border-zinc-200/80 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4 text-amber-600" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onBuyNow(product);
                  }}
                  className="flex-1 py-3 px-4 bg-[#0d382c] hover:bg-[#07241c] text-white rounded-2xl font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buy Now (₹{product.price})</span>
                  <ArrowRight className="h-4 w-4 text-amber-400" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
