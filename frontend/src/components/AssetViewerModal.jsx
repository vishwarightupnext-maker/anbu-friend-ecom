import React from 'react';
import { X, Download, ExternalLink, BookOpen, Image as ImageIcon, Sparkles, ShieldCheck } from 'lucide-react';
import { downloadAssetFile } from '../utils/downloadHelper';

export default function AssetViewerModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  const isPdf = product.fileType === 'pdf' || (product.pdfUrl && product.pdfUrl.includes('.pdf'));
  const assetUrl = product.cloudinaryUrl || product.pdfUrl || product.pngUrl || product.image;

  const handleDownload = () => {
    downloadAssetFile(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              {isPdf ? <BookOpen className="h-5 w-5 text-amber-400" /> : <ImageIcon className="h-5 w-5 text-amber-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 truncate max-w-md">{product.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                  UNLOCKED ASSET
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                {isPdf ? (product.pages || 'PDF E-Book Manuscript') : (product.resolution || '3840 x 3840 Lossless PNG Graphic')}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Center Viewer */}
        <div className="relative aspect-video w-full rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden p-4 group">
          {assetUrl && assetUrl.startsWith('data:image') || assetUrl.endsWith('.png') || assetUrl.endsWith('.jpg') || assetUrl.endsWith('.jpeg') || assetUrl.includes('images/') || !isPdf ? (
            <img
              src={assetUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              className="max-h-72 max-w-full object-contain drop-shadow-lg rounded-xl"
            />
          ) : (
            <div className="text-center text-white space-y-3 py-8">
              <BookOpen className="h-16 w-16 text-amber-400 mx-auto" />
              <div className="text-base font-bold text-white">{product.name}</div>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Official PDF E-Book Manuscript ready for instant download to your device.
              </p>
            </div>
          )}
        </div>

        {/* Download Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-500 font-medium">
            Status: <span className="font-bold text-emerald-700">Ready for instant local save</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 rounded-full border border-zinc-200"
            >
              Close
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="h-4 w-4 text-emerald-400" />
              <span>Download File to Device</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
