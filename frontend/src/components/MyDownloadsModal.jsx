import React, { useState, useEffect } from 'react';
import { X, Download, FileCheck, ExternalLink, Calendar, Search, Sparkles, BookOpen, Copy, Mail } from 'lucide-react';
import { fetchOrders, getDownloadUrl } from '../api';
import { downloadAssetFile } from '../utils/downloadHelper';

export default function MyDownloadsModal({ isOpen, onClose, purchasedProducts }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchOrders()
        .then((res) => setOrders(res || []))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = (prod) => {
    const cloudUrl = prod.cloudinaryUrl || prod.pdfUrl || prod.pngUrl || getDownloadUrl(prod.id || prod._id);
    navigator.clipboard.writeText(cloudUrl);
    setCopiedId(prod.id || prod._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenCloudinary = (prod) => {
    downloadAssetFile(prod);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Purchased Digital Assets & E-Books</h2>
              <p className="text-xs text-zinc-500">Access your Cloudinary email links and downloads anytime</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List of Purchased Items */}
        {purchasedProducts && purchasedProducts.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {purchasedProducts.map((prod, idx) => {
              const isPdf = prod.fileType === 'pdf' || (prod.pdfUrl && prod.pdfUrl.includes('.pdf'));
              const pId = prod.id || prod._id;
              return (
                <div 
                  key={idx}
                  className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 flex items-center justify-between gap-4 hover:bg-zinc-100/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.image || prod.pngUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                      alt={prod.name}
                      className="h-14 w-14 object-contain rounded-xl bg-white border border-zinc-200 p-1 shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = isPdf 
                          ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
                          : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="min-w-0">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        isPdf ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {isPdf ? 'PDF E-BOOK' : 'PNG ASSET'} • EMAILED
                      </span>
                      <h4 className="text-xs font-bold text-zinc-900 truncate mt-1">{prod.name}</h4>
                      <p className="text-[11px] text-zinc-500">{isPdf ? (prod.pages || '148 Pages PDF') : (prod.resolution || '3840 x 3840 PNG')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyLink(prod)}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-full border border-zinc-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copiedId === pId ? 'Copied' : 'Cloudinary Link'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenCloudinary(prod)}
                      className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Open
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 space-y-3">
            <BookOpen className="h-12 w-12 text-zinc-300 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-800">No Purchased Assets Yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              When you purchase an E-Book (PDF) or PNG Digital Asset, your Cloudinary email links and access buttons will be listed here.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-zinc-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-full"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
