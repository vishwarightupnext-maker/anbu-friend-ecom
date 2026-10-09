import React, { useState } from 'react';
import { X, CheckCircle2, Download, Copy, Sparkles, Mail, ExternalLink, Share2, BookOpen, FileText } from 'lucide-react';
import { getDownloadUrl } from '../api';
import { downloadAssetFile } from '../utils/downloadHelper';

export default function PaymentSuccessModal({ order, product, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const isPdf = product.fileType === 'pdf' || (product.pdfUrl && product.pdfUrl.includes('.pdf')) || product.unit?.includes('PDF');
  const targetEmail = order?.customer?.email || 'buyer@example.com';
  const orderId = order?._id || order?.id || 'ORD-DIGITAL-SUCCESS';
  const paymentId = order?.paymentDetails?.razorpayPaymentId || 'PAY-VERIFIED';

  // Cloudinary Download Link
  const cloudinaryLink = product.cloudinaryUrl || product.pdfUrl || product.pngUrl || getDownloadUrl(product.id || product._id);

  const handleCopyCloudinaryLink = () => {
    navigator.clipboard.writeText(cloudinaryLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenCloudinary = () => {
    downloadAssetFile(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 text-center space-y-6">
        
        {/* Success Icon Badge */}
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50 shadow-sm animate-bounce">
          <Mail className="h-9 w-9 text-emerald-600" />
        </div>

        {/* Success Title */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 flex items-center justify-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> PAYMENT VERIFIED • EMAIL DISPATCHED
          </span>
          <h2 className="text-2xl font-extrabold text-zinc-900">Cloudinary Link Sent to Email!</h2>
          <p className="text-xs text-zinc-600">
            We have emailed your secure Cloudinary download link directly to:
          </p>
          <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-800 font-mono">
            {targetEmail}
          </div>
        </div>

        {/* Purchased Asset Box */}
        <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 flex flex-col sm:flex-row items-center gap-4 text-left">
          <div className="relative h-24 w-24 shrink-0 rounded-xl bg-white border border-zinc-200 p-2 flex items-center justify-center overflow-hidden">
            <img 
              src={product.image || product.pngUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'} 
              alt={product.name} 
              className="relative z-10 max-h-full max-w-full object-contain drop-shadow-sm" 
            />
          </div>

          <div className="flex-1 space-y-1">
            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              isPdf ? 'bg-amber-100 text-amber-900' : 'bg-zinc-900 text-white'
            }`}>
              {isPdf ? 'PDF E-BOOK MANUSCRIPT' : 'LOSSLESS 4K PNG'}
            </span>
            <h3 className="font-bold text-sm text-zinc-900">{product.name}</h3>
            <p className="text-xs text-zinc-500">
              {isPdf ? (product.pages || '148 Pages PDF') : (product.resolution || '3840 x 3840 PNG')} • {product.fileSize || '8.5 MB'}
            </p>
            <div className="text-xs text-zinc-700 font-semibold">
              Razorpay Paid: ₹{product.price}
            </div>
          </div>
        </div>

        {/* Cloudinary Link Box */}
        <div className="bg-zinc-900 text-white rounded-2xl p-4 text-left space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Cloudinary Download Link:
            </span>
            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
              Sent via Email
            </span>
          </div>

          <div className="bg-zinc-800/90 rounded-xl p-2.5 font-mono text-xs text-zinc-200 break-all select-all flex items-center justify-between gap-2 border border-zinc-700">
            <span className="truncate">{cloudinaryLink}</span>
            <button
              onClick={handleCopyCloudinaryLink}
              className="px-2.5 py-1 bg-white hover:bg-zinc-100 text-zinc-900 font-sans font-bold text-[11px] rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Copy className="h-3 w-3" />
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleOpenCloudinary}
            className="w-full py-3.5 px-6 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-sm rounded-full shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink className="h-4 w-4 text-emerald-400" />
            <span>OPEN CLOUDINARY DOWNLOAD LINK</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-zinc-500 hover:text-zinc-900 font-semibold"
          >
            Close & Back to Store
          </button>
        </div>

      </div>
    </div>
  );
}
