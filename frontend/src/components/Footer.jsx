import React from 'react';
import { Mail, ShieldCheck, Lock, Truck, RefreshCw, FileText } from 'lucide-react';
import ClyrovaLogo from './ClyrovaLogo';

export default function Footer({ onOpenPolicy }) {
  return (
    <footer className="bg-[#0d382c] text-white pt-12 pb-8 mt-16 text-xs border-t border-zinc-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <ClyrovaLogo size="md" isDark={true} />
            <p className="text-emerald-100/70 text-xs leading-relaxed">
              Official digital products, spreadsheet trackers, PDF guides, and high-resolution digital assets.
            </p>
            <div className="text-[11px] text-amber-400 font-bold">
              Website: clyrova.in
            </div>
          </div>

          {/* Quick Links & Store Policies */}
          <div className="space-y-3">
            <div className="font-extrabold uppercase tracking-wider text-amber-400 text-xs">Store Policies</div>
            <ul className="space-y-2 text-emerald-100/80 font-medium">
              <li>
                <button onClick={() => onOpenPolicy('shipping')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-amber-400" /> Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('refund')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-emerald-400" /> Refund & Cancellation
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-400" /> Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-purple-400" /> Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <div className="font-extrabold uppercase tracking-wider text-amber-400 text-xs">Customer Support</div>
            <div className="space-y-1.5 text-emerald-100/80">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-amber-400" /> support@clyrova.in
              </div>
              <p className="text-[11px]">We reply within 5 to 7 working days.</p>
              <button 
                onClick={() => onOpenPolicy('contact')}
                className="mt-2 text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Help & Contact Guide →
              </button>
            </div>
          </div>

          {/* Secure Payment Badges */}
          <div className="space-y-3">
            <div className="font-extrabold uppercase tracking-wider text-amber-400 text-xs">Payment & Delivery</div>
            <p className="text-emerald-100/70 text-xs">
              All payments are processed through Razorpay in INR. Cloudinary download links are delivered directly to your email instantly after payment.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-[11px] font-bold border border-white/10">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Razorpay Verified Encrypted</span>
            </div>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-emerald-100/60 text-[11px] font-medium">
          <p>© {new Date().getFullYear()} Clyrova (clyrova.in). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onOpenPolicy('terms')} className="hover:text-white">Terms</button>
            <span>•</span>
            <button onClick={() => onOpenPolicy('privacy')} className="hover:text-white">Privacy</button>
            <span>•</span>
            <button onClick={() => onOpenPolicy('shipping')} className="hover:text-white">Delivery</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
