import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  CheckSquare, 
  Square, 
  BookOpen, 
  Mail, 
  Star, 
  ShieldCheck, 
  Layers, 
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function ProductDetailPage({ 
  product, 
  allProducts = [], 
  onBack, 
  onAddToCart, 
  onBuyNow 
}) {
  if (!product) return null;

  // Image Gallery State (Up to 4 images)
  const productImages = Array.isArray(product.images) && product.images.filter(Boolean).length > 0
    ? product.images.filter(Boolean).slice(0, 4)
    : [
        product.image || product.pngUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
      ];

  // If fewer than 4 images, fill with fallback high-res images to guarantee 4 images look
  while (productImages.length < 4) {
    productImages.push(productImages[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80');
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Bundled products logic (up to 3 products)
  const bundledIds = Array.isArray(product.bundledProductIds) ? product.bundledProductIds : [];
  
  // Find matching bundled products from allProducts or generate default fallback bundles if none specified
  let bundledItems = allProducts.filter(p => bundledIds.includes(p.id || p._id));
  if (bundledItems.length === 0 && allProducts.length > 1) {
    // Pick up to 3 other products as recommended bundle
    bundledItems = allProducts
      .filter(p => (p.id || p._id) !== (product.id || product._id))
      .slice(0, 3);
  } else if (bundledItems.length > 3) {
    bundledItems = bundledItems.slice(0, 3);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // State of selected bundle items (default all checked)
  const [selectedBundleMap, setSelectedBundleMap] = useState({});

  useEffect(() => {
    const initialMap = {};
    bundledItems.forEach(item => {
      initialMap[item.id || item._id] = true;
    });
    setSelectedBundleMap(initialMap);
  }, [product, allProducts]);

  const toggleBundleItem = (itemId) => {
    setSelectedBundleMap(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Selected bundle calculation
  const activeBundledProducts = bundledItems.filter(item => selectedBundleMap[item.id || item._id]);
  const bundleItemsPriceTotal = activeBundledProducts.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const mainProductPrice = parseFloat(product.price) || 0;
  const grandBundleTotal = mainProductPrice + bundleItemsPriceTotal;

  const isPdf = product.fileType === 'pdf' || (product.pdfUrl && product.pdfUrl.includes('.pdf')) || product.unit?.includes('PDF');

  // Add main product + active bundled products to cart
  const handleAddBundleToCart = () => {
    onAddToCart(product, 1, activeBundledProducts);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Products</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
            <span>Store Catalog</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-zinc-900 font-bold truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Single Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xl overflow-hidden p-6 sm:p-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: 4 Images Gallery View (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Main Image Frame */}
              <div className="relative aspect-square w-full rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center p-6 overflow-hidden group shadow-inner">
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />
                <img
                  src={productImages[activeImageIndex]}
                  alt={`${product.name} view ${activeImageIndex + 1}`}
                  className="relative z-10 max-h-80 object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = isPdf
                      ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
                      : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                
                <span className="absolute top-4 left-4 z-20 px-3 py-1 text-[11px] font-black uppercase bg-[#0d382c] text-amber-400 rounded-lg shadow-sm flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Image {activeImageIndex + 1} of {productImages.length}
                </span>
              </div>

              {/* 4 Thumbnails Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Product Media Gallery (4 Images)</span>
                  <span className="text-[11px] text-zinc-400 font-medium">Click thumbnail to switch preview</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square rounded-xl bg-zinc-50 border-2 overflow-hidden p-1 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#0d382c] ring-2 ring-[#0d382c]/20 shadow-md scale-105'
                          : 'border-zinc-200 opacity-75 hover:opacity-100 hover:border-zinc-400'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                      {activeImageIndex === idx && (
                        <div className="absolute inset-0 bg-[#0d382c]/10 border border-[#0d382c] rounded-lg" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Assurance */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3">
                <Mail className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-emerald-950">Cloudinary Automated Email Delivery</h4>
                  <p className="text-emerald-800 mt-0.5">
                    Upon checkout completion, full high-resolution digital files are instantly sent to your email.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Product Info & Bundle Configuration (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-md border ${
                    isPdf ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-zinc-900 text-white border-zinc-900'
                  }`}>
                    {isPdf ? 'PDF E-BOOK' : '4K PNG GRAPHIC'}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500">{product.categoryName || product.category || 'Digital Store'}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-2 tracking-tight">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-zinc-700">5.0 (48 Verified Customer Reviews)</span>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-zinc-900">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm font-semibold text-zinc-400 line-through">₹{product.originalPrice}</span>
                  )}
                  {product.discount > 0 && (
                    <span className="text-xs font-extrabold bg-red-100 text-red-700 px-2.5 py-1 rounded-full border border-red-200">
                      SAVE {product.discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-xs text-zinc-600 leading-relaxed bg-zinc-50/80 rounded-2xl p-4 border border-zinc-200/80">
                <p>{product.description || 'Authentic digital product created according to traditional standards. Guaranteed instant Cloudinary email delivery upon checkout.'}</p>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-zinc-200 rounded-xl">
                  <span className="text-zinc-400 block text-[10px] font-bold uppercase">Format</span>
                  <span className="font-bold text-zinc-900">{isPdf ? 'PDF Manuscript' : 'PNG Asset'}</span>
                </div>
                <div className="p-3 bg-white border border-zinc-200 rounded-xl">
                  <span className="text-zinc-400 block text-[10px] font-bold uppercase">Delivery</span>
                  <span className="font-bold text-emerald-700">Email Cloudinary Link</span>
                </div>
                {isPdf ? (
                  <>
                    <div className="p-3 bg-white border border-zinc-200 rounded-xl">
                      <span className="text-zinc-400 block text-[10px] font-bold uppercase">Pages</span>
                      <span className="font-bold text-zinc-900">{product.pages || '120 Pages'}</span>
                    </div>
                    <div className="p-3 bg-white border border-zinc-200 rounded-xl">
                      <span className="text-zinc-400 block text-[10px] font-bold uppercase">Author</span>
                      <span className="font-bold text-zinc-900">{product.author || 'Varahi Siddhar Research'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-white border border-zinc-200 rounded-xl">
                      <span className="text-zinc-400 block text-[10px] font-bold uppercase">Resolution</span>
                      <span className="font-bold text-zinc-900">{product.resolution || '3840 x 3840 px'}</span>
                    </div>
                    <div className="p-3 bg-white border border-zinc-200 rounded-xl">
                      <span className="text-zinc-400 block text-[10px] font-bold uppercase">License</span>
                      <span className="font-bold text-zinc-900">Personal & Commercial</span>
                    </div>
                  </>
                )}
              </div>

              {/* Single Product Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => onAddToCart(product, 1)}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-extrabold text-xs border border-zinc-300/80 shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4 text-amber-600" />
                  <span>Add Main Product Only (₹{product.price})</span>
                </button>

                <button
                  onClick={() => onBuyNow(product)}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buy Main Product Now</span>
                </button>
              </div>

              {/* BUNDLE & SAVE CHECKOUT SECTION */}
              <div className="mt-8 bg-gradient-to-br from-emerald-900 via-[#0d382c] to-zinc-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-700/50 space-y-5">
                
                <div className="flex items-center justify-between border-b border-emerald-700/50 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center font-black shadow-sm">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight text-white">Bundle & Save Offer</h3>
                      <p className="text-[11px] text-emerald-200">Pair up to 3 recommended products for full checkout bundle</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-amber-400 text-zinc-950 px-2.5 py-1 rounded-full">
                    {activeBundledProducts.length + 1} ITEMS IN BUNDLE
                  </span>
                </div>

                {/* Bundle Item Selection Cards */}
                <div className="space-y-3">
                  
                  {/* Main Product Card (Always Included in Bundle) */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-md bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </div>
                      <img src={product.image || product.pngUrl} alt={product.name} className="h-10 w-10 object-contain rounded-lg bg-white/20 p-1" />
                      <div>
                        <span className="text-[9px] font-bold text-amber-300 uppercase block">Main Product</span>
                        <h4 className="text-xs font-bold text-white truncate max-w-xs">{product.name}</h4>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-300">₹{product.price}</span>
                  </div>

                  {/* Up to 3 Bundled Products Checklist */}
                  {bundledItems.length === 0 ? (
                    <div className="text-center py-4 text-xs text-emerald-200/70">
                      No additional bundled items added for this product.
                    </div>
                  ) : (
                    bundledItems.map((bItem) => {
                      const bId = bItem.id || bItem._id;
                      const isChecked = !!selectedBundleMap[bId];
                      return (
                        <div
                          key={bId}
                          onClick={() => toggleBundleItem(bId)}
                          className={`cursor-pointer rounded-2xl p-3 border transition-all flex items-center justify-between gap-3 ${
                            isChecked
                              ? 'bg-white/15 border-amber-400/80 text-white'
                              : 'bg-white/5 border-white/10 text-emerald-200/60 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                              isChecked ? 'bg-amber-400 text-zinc-950' : 'border border-white/30 text-transparent'
                            }`}>
                              <Check className="h-4 w-4 stroke-[3]" />
                            </div>
                            <img
                              src={bItem.image || bItem.pngUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                              alt={bItem.name}
                              className="h-10 w-10 object-contain rounded-lg bg-white/20 p-1 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-[9px] font-bold uppercase text-emerald-300 block">Bundle Add-on (Optional)</span>
                              <h4 className="text-xs font-bold text-white truncate">{bItem.name}</h4>
                            </div>
                          </div>
                          <span className="text-xs font-black text-amber-300 shrink-0">+₹{bItem.price}</span>
                        </div>
                      );
                    })
                  )}

                </div>

                {/* Total & Action Button */}
                <div className="pt-3 border-t border-emerald-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-emerald-200 block font-semibold">Total Bundle Checkout Amount</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-amber-400">₹{grandBundleTotal.toLocaleString()}</span>
                      {activeBundledProducts.length > 0 && (
                        <span className="text-xs text-emerald-300 font-semibold">
                          ({activeBundledProducts.length + 1} products total)
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleAddBundleToCart}
                    className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-2xl font-black text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add Complete Bundle to Cart (₹{grandBundleTotal.toLocaleString()})</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
