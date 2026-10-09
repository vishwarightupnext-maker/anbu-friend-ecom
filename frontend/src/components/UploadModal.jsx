import React, { useState } from 'react';
import { X, Upload, BookOpen, Image as ImageIcon, Sparkles, Check, AlertCircle, FileText, Link as LinkIcon, Layers } from 'lucide-react';
import { createDigitalProduct } from '../api';

export default function UploadModal({ isOpen, onClose, onProductCreated, existingProducts = [] }) {
  const [fileType, setFileType] = useState('png'); // 'png' or 'pdf'
  const [name, setName] = useState('');
  const [price, setPrice] = useState('299');
  const [categoryName, setCategoryName] = useState('E-Books (PDF)');
  const [description, setDescription] = useState('');
  const [resolution, setResolution] = useState('3840 x 3840 px (300 DPI)');
  const [pages, setPages] = useState('120 Pages');
  const [author, setAuthor] = useState('Varahi Siddhar Research');
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  
  // 4 Images File State (Data URLs / base64)
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');
  const [img4, setImg4] = useState('');
  
  // Bundled product selection (up to 3 products)
  const [selectedBundle1, setSelectedBundle1] = useState('');
  const [selectedBundle2, setSelectedBundle2] = useState('');
  const [selectedBundle3, setSelectedBundle3] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Handle batch selection of multiple files (up to 4 images at once)
  const handleBatchFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError('');
    const setterList = [setImg1, setImg2, setImg3, setImg4];

    files.slice(0, 4).forEach((file, index) => {
      const reader = new FileReader();

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setFileType('pdf');
        setCategoryName('E-Books (PDF)');
        if (!name && index === 0) {
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
        const demoImg = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
        setterList[index](demoImg);
        setCloudinaryUrl(`https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/ebooks/${file.name}`);
      } else {
        setFileType('png');
        reader.onload = (event) => {
          const result = event.target.result;
          setterList[index](result);
          if (!name && index === 0) {
            const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
            setName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Single slot file change
  const handleSingleSlotChange = (e, slotIndex) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setterList = [setImg1, setImg2, setImg3, setImg4];
    const reader = new FileReader();

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const demoImg = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
      setterList[slotIndex](demoImg);
    } else {
      reader.onload = (event) => {
        setterList[slotIndex](event.target.result);
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

      // Build 4 Images list from file uploads
      const imagesArray = [img1, img2, img3, img4].filter(Boolean);
      if (imagesArray.length === 0) {
        imagesArray.push(isPdf ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
      }

      // Build bundled product IDs list
      const bundledProductIds = [selectedBundle1, selectedBundle2, selectedBundle3].filter(Boolean);

      const newProduct = await createDigitalProduct({
        name,
        description: description || `Digital asset download (${isPdf ? 'PDF E-Book' : 'PNG Asset'}). Cloudinary download link dispatched to user email upon payment.`,
        price: parseFloat(price) || 299,
        fileType,
        image: imagesArray[0],
        images: imagesArray,
        bundledProductIds,
        pngUrl: isPdf ? '' : (imagesArray[0] || finalCloudinaryLink),
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

  const imageSlots = [
    { title: 'Primary Image 1', val: img1, setVal: setImg1, idx: 0 },
    { title: 'Gallery Image 2', val: img2, setVal: setImg2, idx: 1 },
    { title: 'Gallery Image 3', val: img3, setVal: setImg3, idx: 2 },
    { title: 'Gallery Image 4', val: img4, setVal: setImg4, idx: 3 },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Add Product & Configure Bundles</h2>
              <p className="text-xs text-zinc-500">Upload 4 image files & attach up to 3 bundle products</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 cursor-pointer"
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

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 4 PRODUCT IMAGES DEDICATED FILE UPLOAD SECTION */}
          <div className="space-y-3 bg-zinc-50/80 p-4 rounded-2xl border border-zinc-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-2">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-emerald-600" />
                Upload 4 Product Image Files
              </label>

              {/* Batch Upload Button */}
              <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-[11px] font-bold cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5 text-amber-400" />
                <span>Upload 4 Files at Once</span>
                <input
                  type="file"
                  accept="image/*, application/pdf"
                  multiple
                  onChange={handleBatchFileChange}
                  className="hidden"
                />
              </label>
            </div>
            
            {/* 4 File Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {imageSlots.map(({ title, val, setVal, idx }) => (
                <div key={idx} className="bg-white rounded-xl p-2.5 border border-zinc-200 text-center space-y-2 flex flex-col justify-between shadow-xs">
                  <span className="text-[10px] font-extrabold text-zinc-700 block truncate">{title}</span>
                  
                  {val ? (
                    <div className="relative aspect-square w-full rounded-lg bg-zinc-50 border border-zinc-200 overflow-hidden flex items-center justify-center p-1 group">
                      <img src={val} alt={`Slot ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setVal('')}
                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md cursor-pointer"
                        title="Remove Image File"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-zinc-300 hover:border-emerald-500 bg-zinc-50 hover:bg-emerald-50/20 flex flex-col items-center justify-center p-2 cursor-pointer transition-colors">
                      <Upload className="h-5 w-5 text-zinc-400 mb-1" />
                      <span className="text-[10px] font-bold text-zinc-700">Choose File</span>
                      <span className="text-[9px] text-zinc-400 mt-0.5">Image {idx + 1}</span>
                      <input
                        type="file"
                        accept="image/*, application/pdf"
                        onChange={(e) => handleSingleSlotChange(e, idx)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* BUNDLE OFFER SELECTION (UP TO 3 PRODUCTS FROM PREVIOUS CATALOG) */}
          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 space-y-3">
            <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-emerald-700" />
              Configure Bundle Checkout Offer (Pick Up to 3 Previous Products to Bundle)
            </label>
            <p className="text-[11px] text-emerald-800">
              When users view or add this product to cart, these 3 bundled products will be loaded together under it for a bundle total checkout!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-emerald-900 mb-1">Bundle Product 1</label>
                <select
                  value={selectedBundle1}
                  onChange={(e) => setSelectedBundle1(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl focus:outline-none"
                >
                  <option value="">-- Optional Bundle Item 1 --</option>
                  {existingProducts.map(p => (
                    <option key={p.id || p._id} value={p.id || p._id}>{p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-emerald-900 mb-1">Bundle Product 2</label>
                <select
                  value={selectedBundle2}
                  onChange={(e) => setSelectedBundle2(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl focus:outline-none"
                >
                  <option value="">-- Optional Bundle Item 2 --</option>
                  {existingProducts.map(p => (
                    <option key={p.id || p._id} value={p.id || p._id}>{p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-emerald-900 mb-1">Bundle Product 3</label>
                <select
                  value={selectedBundle3}
                  onChange={(e) => setSelectedBundle3(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl focus:outline-none"
                >
                  <option value="">-- Optional Bundle Item 3 --</option>
                  {existingProducts.map(p => (
                    <option key={p.id || p._id} value={p.id || p._id}>{p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Product Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={fileType === 'pdf' ? 'e.g. Siddhar Healing Remedies PDF' : 'e.g. Premium Tracker Asset'}
                required
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:border-zinc-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Category</label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:border-zinc-900 font-bold"
              >
                <option value="Trackers">Trackers</option>
                <option value="Business Tools">Business Tools</option>
                <option value="Templates">Templates</option>
                <option value="E-Books">E-Books</option>
                <option value="Courses">Courses</option>
                <option value="SaaS Products">SaaS Products</option>
                <option value="Digital Yantras">Digital Yantras</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Price (₹ INR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299"
                required
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:border-zinc-900 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of product..."
              className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:border-zinc-900 font-medium"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-full cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-semibold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {loading ? (
                <span>Publishing Product & Bundle...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Save Product & Bundle Offer</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
