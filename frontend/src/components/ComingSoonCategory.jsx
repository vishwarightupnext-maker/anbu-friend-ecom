import React, { useState } from 'react';
import { Sparkles, Rocket, Mail, Check, Bell, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';

export default function ComingSoonCategory({ categoryName, onExploreAll }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  const displayName = categoryName 
    ? categoryName.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) 
    : 'Digital Assets';

  return (
    <div className="my-8 rounded-3xl bg-gradient-to-br from-[#0d382c] via-[#07241c] to-zinc-950 text-white p-8 sm:p-14 shadow-2xl border border-emerald-800/40 relative overflow-hidden font-sans">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black tracking-wider uppercase backdrop-blur-md shadow-sm">
          <Rocket className="h-4 w-4 text-amber-400 animate-bounce" />
          <span>Category Coming Soon</span>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {displayName} Section Launching Soon!
          </h2>
          <p className="text-sm text-emerald-100/80 leading-relaxed max-w-lg mx-auto">
            We are actively crafting and curating high-quality <strong className="text-amber-300">{displayName}</strong> for you. Sign up below to get early access and exclusive launch discounts!
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <Zap className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Instant Delivery</h4>
              <p className="text-[10px] text-emerald-200/70">Cloudinary Email Link</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Verified Quality</h4>
              <p className="text-[10px] text-emerald-200/70">100% Authentic Content</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-amber-300 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Early Bird Deals</h4>
              <p className="text-[10px] text-emerald-200/70">Up to 50% Off Launch</p>
            </div>
          </div>
        </div>

        {/* Email Launch Alert Signup */}
        <div className="pt-4 max-w-md mx-auto">
          {subscribed ? (
            <div className="p-4 bg-emerald-900/80 border border-emerald-500 text-emerald-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold animate-fade-in shadow-lg">
              <Check className="h-5 w-5 text-amber-400 stroke-[3]" />
              <span>You're on the VIP list! We will notify you as soon as {displayName} launches!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`Enter email for ${displayName} launch...`}
                  required
                  className="w-full pl-10 pr-4 py-3 text-xs bg-white/10 border border-white/20 rounded-2xl text-white placeholder-emerald-200/50 focus:outline-none focus:bg-white/20 focus:border-amber-400 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-2xl font-black text-xs shadow-lg transition-all active:scale-95 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Bell className="h-4 w-4 fill-zinc-950" />
                <span>Notify Me</span>
              </button>
            </form>
          )}
        </div>

        {/* Return Button */}
        <div className="pt-2">
          <button
            onClick={onExploreAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
          >
            <span>Explore All Available Digital Assets</span>
            <ArrowRight className="h-4 w-4 text-amber-400" />
          </button>
        </div>

      </div>
    </div>
  );
}
