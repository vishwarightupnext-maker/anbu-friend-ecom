import React from 'react';
import { BookOpen, Mail, ShieldCheck, CheckCircle2, Sparkles, FileText } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="bg-white border-b border-zinc-200/80 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        
        {/* Minimal pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Digital Products & E-Books (PDF) • Cloudinary Direct Email Delivery</span>
        </div>

        {/* Clean Typography */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 leading-tight">
          E-Books (PDF) & Lossless PNG Digital Assets.<br />
          <span className="text-zinc-500 font-normal">Pay once & get Cloudinary link directly in your Email.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-600 leading-relaxed">
          Access complete Siddhar remedies E-Books (PDF) and 4K vector PNG graphics. Fill your email at checkout and instantly receive your personal Cloudinary download link right in your inbox!
        </p>

        {/* Action Highlights */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-600 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>PDF E-Books & PNG Assets</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-emerald-600" />
            <span>Cloudinary Email Link Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Razorpay Test Payment Enabled</span>
          </div>
        </div>

      </div>
    </section>
  );
}
