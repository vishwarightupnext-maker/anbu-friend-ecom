import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Truck, RefreshCw, FileText, Lock, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import ClyrovaLogo from './ClyrovaLogo';

export default function PolicyModal({ isOpen, onClose, initialTab = 'shipping' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-[#0d382c] text-white px-6 py-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <ClyrovaLogo size="sm" isDark={true} />
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 hidden sm:inline-block">
              OFFICIAL STORE POLICIES
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="bg-zinc-100 border-b border-zinc-200 px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'bg-[#0d382c] text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
            }`}
          >
            <Truck className="h-4 w-4 text-amber-400" />
            <span>Shipping & Delivery</span>
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'refund'
                ? 'bg-[#0d382c] text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
            }`}
          >
            <RefreshCw className="h-4 w-4 text-emerald-400" />
            <span>Refund & Cancellation</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'terms'
                ? 'bg-[#0d382c] text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
            }`}
          >
            <FileText className="h-4 w-4 text-blue-400" />
            <span>Terms & Conditions</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-[#0d382c] text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
            }`}
          >
            <Lock className="h-4 w-4 text-purple-400" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>Contact & Support</span>
          </button>
        </div>

        {/* Content Body Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-zinc-800 text-xs sm:text-sm leading-relaxed">
          
          {/* TAB 1: SHIPPING AND DELIVERY */}
          {activeTab === 'shipping' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-zinc-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-zinc-900">Shipping and Delivery Policy</h3>
                  <p className="text-xs text-zinc-500">Website: clyrova.in • Last updated: 6 October 2026</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-full">
                  Instant Digital Delivery
                </span>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1">
                <div className="font-extrabold text-emerald-950 text-xs uppercase tracking-wider">No Shipping Charges</div>
                <p className="text-xs text-emerald-900 font-medium">
                  All Clyrova products are digital files. Nothing physical is shipped, and there are no shipping charges.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> How you get your files:
                </h4>
                <ul className="space-y-2 pl-4 list-disc text-zinc-700">
                  <li>Right after your payment succeeds, you get an instant download link on the order confirmation page.</li>
                  <li>The same secure Cloudinary download link is automatically sent to the email address you used at checkout.</li>
                  <li>Please save the files to your device for easy access anytime.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> What is included:
                </h4>
                <p className="text-zinc-700">
                  Your product page lists the files you receive upon checkout, for example spreadsheet trackers (Google Sheets link and Excel file) and authentic PDF manuscript guides.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: REFUND AND CANCELLATION */}
          {activeTab === 'refund' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-zinc-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-zinc-900">Refund & Cancellation Policy</h3>
                  <p className="text-xs text-zinc-500">Website: clyrova.in • Last updated: 7 October 2026</p>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs rounded-full">
                  Digital Product Terms
                </span>
              </div>

              <p className="text-zinc-700">
                Thank you for choosing Clyrova. All our products are digital files that you can download and use right away. Because digital files cannot be returned once delivered, we do not offer refunds on our products. Please read the product page carefully before buying. We want you to be happy, so if anything goes wrong, we are here to help you.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <h4 className="text-xs font-extrabold uppercase text-emerald-950 tracking-wider">What we will do for you:</h4>
                  <ul className="space-y-1.5 text-xs text-emerald-900 list-disc pl-4 font-medium">
                    <li>If you paid but did not receive your files, we will send them again immediately.</li>
                    <li>If a file is damaged or will not open, we will fix it or send you a new copy.</li>
                    <li>If you were charged more than once for the same order, we will return the extra payment to your original payment method (5 to 7 working days processing).</li>
                    <li>If you need help using a product, we are happy to guide you.</li>
                  </ul>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
                  <h4 className="text-xs font-extrabold uppercase text-zinc-900 tracking-wider">What is not covered:</h4>
                  <ul className="space-y-1.5 text-xs text-zinc-600 list-disc pl-4">
                    <li>Change of mind, or no longer needing the product after delivery.</li>
                    <li>Results that are different from what you hoped. Results differ from person to person.</li>
                    <li>Not having Google Sheets, Excel or a PDF reader, or using an unsupported device.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3.5 bg-zinc-100 rounded-2xl space-y-1 text-xs text-zinc-700">
                <div className="font-bold text-zinc-900">Cancellations & Legal Notice:</div>
                <p>Because files are delivered instantly after payment, orders cannot be cancelled once payment is complete. This policy does not take away any statutory rights under Indian consumer law.</p>
              </div>
            </div>
          )}

          {/* TAB 3: TERMS AND CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-zinc-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-zinc-900">Terms and Conditions</h3>
                  <p className="text-xs text-zinc-500">Website: clyrova.in • Last updated: 6 October 2026</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs rounded-full">
                  Terms of Service
                </span>
              </div>

              <p className="text-zinc-700">
                By buying from or using clyrova.in, you agree to these terms. Please read them once.
              </p>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-zinc-900">1. Our Products</h4>
                  <p className="text-zinc-600">We sell digital products such as spreadsheet trackers and PDF guides. Nothing physical is shipped.</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-zinc-900">2. Orders and Payment</h4>
                  <p className="text-zinc-600">• Prices are in Indian rupees (INR) and shown on the product page. Payments are processed securely via Razorpay. Your order is confirmed when payment succeeds.</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-zinc-900">3. Licence: Personal Use Only</h4>
                  <p className="text-zinc-600">• One purchase is for one person's personal use. Please do not copy, share, resell, upload, or give away the files, links, or any part of them. All rights stay with Clyrova.</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-zinc-900">4. Health Disclaimer & Responsibility</h4>
                  <p className="text-zinc-600">• Our guides and trackers are tools for learning. They are not medical advice and do not diagnose or treat any condition. Products are for adults (18 and above). Please consult your doctor if needed.</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-zinc-900">5. Governing Law</h4>
                  <p className="text-zinc-600">• These terms follow the laws of India. Courts in Tamil Nadu handle any dispute. Contact: support@clyrova.in.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-zinc-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-zinc-900">Privacy Policy</h3>
                  <p className="text-xs text-zinc-500">Website: clyrova.in • Last updated: 6 October 2026</p>
                </div>
                <span className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 font-bold text-xs rounded-full">
                  Data Protection
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-zinc-900">What We Collect</h4>
                <p className="text-zinc-600">
                  Your name, email address, and billing details entered at checkout, order details, and technical data like IP address and browser type. Trackers downloaded are used on your own device; we cannot see what you type into them.
                </p>

                <h4 className="font-extrabold text-zinc-900">Payment Security</h4>
                <p className="text-zinc-600">
                  Payments are processed by Razorpay. We do not see or store your card, UPI, or bank details.
                </p>

                <h4 className="font-extrabold text-zinc-900">Your Rights</h4>
                <p className="text-zinc-600">
                  You can ask us to show, correct, or delete your information at any time by emailing <strong>support@clyrova.in</strong>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT & SUPPORT */}
          {activeTab === 'contact' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-zinc-200 pb-3">
                <h3 className="text-lg font-black text-zinc-900">Contact & Customer Support</h3>
                <p className="text-xs text-zinc-500">We are here to assist you with your orders and downloads</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500 text-zinc-950 rounded-2xl font-black">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">Official Support Email</div>
                    <a href="mailto:support@clyrova.in" className="text-lg font-black text-zinc-950 underline hover:text-amber-800">
                      support@clyrova.in
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-amber-200/80 text-xs text-amber-950">
                  <div>
                    <span className="font-extrabold block">Reply Time:</span>
                    <span>We reply within 5 to 7 working days.</span>
                  </div>
                  <div>
                    <span className="font-extrabold block">What to include:</span>
                    <span>Your order number and the email you used at checkout.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#0d382c] hover:bg-[#07241c] text-white text-xs font-bold rounded-full cursor-pointer"
          >
            Close Policy Modal
          </button>
        </div>

      </div>
    </div>
  );
}
