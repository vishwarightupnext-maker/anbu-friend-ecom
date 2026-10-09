import React, { useState } from 'react';
import { ShieldCheck, Download, Search, BookOpen, Menu, X, ShoppingBag } from 'lucide-react';
import ClyrovaLogo from './ClyrovaLogo';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  activeCategory, 
  setActiveCategory, 
  onOpenAdmin, 
  onOpenMyDownloads,
  purchasedCount,
  cartCount,
  onOpenCart
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: '', label: 'All Digital Assets' },
    { id: 'trackers', label: 'Trackers' },
    { id: 'business-tools', label: 'Business Tools' },
    { id: 'templates', label: 'Templates' },
    { id: 'ebooks', label: 'E-Books' },
    { id: 'courses', label: 'Courses' },
    { id: 'saas-products', label: 'SaaS Products' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo - Clyrova. */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSearchQuery(''); setActiveCategory(''); }}>
            <ClyrovaLogo size="md" />
            <span className="hidden lg:inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 uppercase tracking-wider">
              STORE • EMAIL LINK DELIVERY
            </span>
          </div>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search E-Books (PDF), Yantras, Siddhar Art..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-extrabold bg-[#0d382c] hover:bg-[#08261e] text-white shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 text-amber-400" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-zinc-950 font-black text-[10px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Separate Admin Dashboard Button */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200/80 transition-all active:scale-98 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Purchased Downloads Button */}
            <button
              onClick={onOpenMyDownloads}
              className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200/80 transition-all active:scale-98 cursor-pointer"
            >
              <Download className="h-4 w-4 text-zinc-700" />
              <span className="hidden sm:inline">Purchased</span>
              {purchasedCount > 0 && (
                <span className="ml-1 bg-zinc-900 text-white font-bold text-[10px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
                  {purchasedCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden py-2 border-t border-zinc-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search E-Books & PNGs..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white focus:border-zinc-900"
            />
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar text-xs border-t border-zinc-100">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id || 'all'}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0d382c] text-white shadow-xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 px-4 py-3 space-y-2 animate-fade-in">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Quick Actions</div>
          <button
            onClick={() => { onOpenCart(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-900 font-bold bg-amber-50 border border-amber-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-4 w-4 text-amber-600" /> View Shopping Cart
            </div>
            <span className="bg-[#0d382c] text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {cartCount} items
            </span>
          </button>
          <button
            onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg font-semibold"
          >
            <ShieldCheck className="h-4 w-4 text-amber-600" /> Open Admin Portal
          </button>
          <button
            onClick={() => { onOpenMyDownloads(); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg font-semibold"
          >
            <Download className="h-4 w-4 text-zinc-500" /> View Purchased Downloads ({purchasedCount})
          </button>
        </div>
      )}
    </header>
  );
}
