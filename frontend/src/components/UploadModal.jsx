import React, { useState } from 'react';
import { X, Upload, BookOpen, Image as ImageIcon, Sparkles, Check, AlertCircle, FileText, Link as LinkIcon } from 'lucide-react';
import { createDigitalProduct } from '../api';

export default function UploadModal({ isOpen, onClose, onProductCreated }) {
  const [fileType, setFileType] = useState('png'); // 'png' or 'pdf'
  const [name, setName] = useState('');
  const [price, setPrice] = useState('299');
  const [categoryName, setCategoryName] = useState('E-Books (PDF)');
  const [description, setDescription] = useState('');
  const [resolution, setResolution] = useState('3840 x 3840 px (300 DPI)');
  const [pages, setPages] = useState('120 Pages');
  const [author, setAuthor] = useState('Varahi Siddhar Research');
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    const reader = new FileReader();

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setFileType('pdf');
      setCategoryName('E-Books (PDF)');
      if (!name) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
      // Demo placeholder cover image for PDF
      setImagePreview('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80');
      setCloudinaryUrl(`https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/ebooks/${file.name}`);
    } else {
      setFileType('png');
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        if (!name) {
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const categoryId = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const isPdf = fileType === 'pdf';

      const finalCloudinaryLink = cloudinaryUrl || `https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/uploads/${Date.now()}.${isPdf ? 'pdf' : 'png'}`;

      const newProduct = await createDigitalProduct({
        name,
        description: description || `Digital asset download (${isPdf ? 'PDF E-Book' : 'PNG Asset'}). Cloudinary download link dispatched to user email upon payment.`,
        price: parseFloat(price) || 299,
        fileType,
        image: imagePreview || (isPdf ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'),
        pngUrl: isPdf ? '' : (imagePreview || finalCloudinaryLink),
        pdfUrl: isPdf ? finalCloudinaryLink : '',
        cloudinaryUrl: finalCloudinaryLink,
        categoryName,
        categoryId,
        resolution: isPdf ? 'PDF Document' : resolution,
        pages: isPdf ? pages : '',
        author: isPdf ? author : '',
        fileSize: isPdf ? '8.5 MB' : '14.2 MB'
      });

      onProductCreated(newProduct);
      onClose();
    } catch (err) {
      setError(err.message || 'Error uploading product. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Upload Digital Asset / E-Book</h2>
              <p className="text-xs text-zinc-500">Publish PDF E-Books or PNG Graphics with Cloudinary Email Delivery</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Asset Format Selector */}
        <div className="flex items-center gap-3 p-1 bg-zinc-100 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setFileType('png'); setCategoryName('Digital Yantras'); }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              fileType === 'png' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <ImageIcon className="h-4 w-4" /> PNG Image Asset
          </button>
          <button
            type="button"
            onClick={() => { setFileType('pdf'); setCategoryName('E-Books (PDF)'); }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              fileType === 'pdf' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <BookOpen className="h-4 w-4 text-amber-600" /> PDF E-Book
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* File Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-2">
              Select {fileType === 'pdf' ? 'PDF E-Book Document' : 'PNG Image File'}
            </label>

            {imagePreview ? (
              <div className="relative aspect-video w-full rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-300 p-4 flex items-center justify-center overflow-hidden">
                <img src={imagePreview} alt="Preview" className="max-h-40 object-contain rounded-lg shadow-sm" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 px-3 py-1 bg-zinc-900/80 hover:bg-zinc-900 text-white text-xs rounded-full backdrop-blur-xs"
                >
                  Change File
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-zinc-50/50 hover:bg-zinc-50">
                {fileType === 'pdf' ? (
                  <FileText className="h-8 w-8 text-amber-500 mb-2" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-zinc-400 mb-2" />
                )}
                <span className="text-xs font-semibold text-zinc-800">
                  Click to upload {fileType === 'pdf' ? '.PDF E-Book file' : '.PNG Image'}
                </span>
                <span className="text-[11px] text-zinc-400 mt-1">Supports PDF, PNG, WebP (up to 50MB)</span>
                <input 
                  type="file" 
                  accept={fileType === 'pdf' ? 'application/pdf' : 'image/png, image/jpeg, image/webp'} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            )}
          </div>

          {/* Cloudinary Link Input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1 flex items-center justify-between">
              <span>Cloudinary Download URL</span>
              <span className="text-[10px] text-zinc-400 font-normal">Sent to customer email on payment</span>
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="url"
                value={cloudinaryUrl}
                onChange={(e) => setCloudinaryUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/varahi-digital/upload/book.pdf"
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Product Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={fileType === 'pdf' ? 'e.g. Siddhar Healing Remedies PDF' : 'e.g. Gold Yantra PNG'}
                required
                className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Price (₹ INR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299"
                required
                className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
              />
            </div>
          </div>

          {fileType === 'pdf' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Page Count</label>
                <input
                  type="text"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="148 Pages"
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Author / Publisher</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Siddhar Research Forum"
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Category</label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
                >
                  <option value="Digital Yantras">Digital Yantras</option>
                  <option value="Sacred Symbols">Sacred Symbols</option>
                  <option value="Minimalist Art">Minimalist Art</option>
                  <option value="Custom Uploads">Custom Uploads</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Resolution Specs</label>
                <input
                  type="text"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="3840 x 3840 px (300 DPI)"
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of contents, chapters, or asset specifications..."
              className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-semibold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {loading ? (
                <span>Publishing Asset...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Publish & Enable Cloudinary Delivery</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
