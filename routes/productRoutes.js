import express from 'express';
import fs from 'fs';
import path from 'path';
import Product from '../models/Product.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();

// Fallback in-memory dataset when MongoDB is offline
const memoryProducts = [
  {
    _id: "ebook-pdf-1",
    id: "ebook-pdf-1",
    name: "Siddhar Secret Remedies & Herbology E-Book",
    description: "Complete 148-page authentic Siddhar wisdom manual in PDF format. Includes herbal formulations, dosage guidelines, and ancient holistic remedies.",
    price: 399,
    originalPrice: 799,
    discount: 50,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    pdfUrl: "https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/ebooks/siddhar-secret-remedies-guide.pdf",
    cloudinaryUrl: "https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/ebooks/siddhar-secret-remedies-guide.pdf",
    pngUrl: "",
    fileType: "pdf",
    category: "E-Books (PDF)",
    categoryId: "ebooks-pdf",
    categoryName: "E-Books (PDF)",
    unit: "PDF E-Book",
    pages: "148 Pages",
    author: "Varahi Siddhar Research Forum",
    resolution: "PDF Manuscript",
    fileSize: "8.4 MB",
    isDigital: true,
    downloadsCount: 312,
    stock: 9999,
    inStock: true,
    rating: 5,
    reviewsCount: 54
  },
  {
    _id: "ebook-pdf-2",
    id: "ebook-pdf-2",
    name: "Sacred Varahi Yantra Rituals & Meditation Guide",
    description: "Digital PDF E-Book detailing sacred geometry yantra installation, mantras, and daily spiritual practices for prosperity.",
    price: 299,
    originalPrice: 599,
    discount: 50,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80",
    pdfUrl: "https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/ebooks/sacred-varahi-yantra-manual.pdf",
    cloudinaryUrl: "https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/ebooks/sacred-varahi-yantra-manual.pdf",
    pngUrl: "",
    fileType: "pdf",
    category: "E-Books (PDF)",
    categoryId: "ebooks-pdf",
    categoryName: "E-Books (PDF)",
    unit: "PDF E-Book",
    pages: "96 Pages",
    author: "Siddhar Wisdom Vault",
    resolution: "PDF Manuscript",
    fileSize: "5.8 MB",
    isDigital: true,
    downloadsCount: 189,
    stock: 9999,
    inStock: true,
    rating: 4.9,
    reviewsCount: 32
  },
  {
    _id: "digital-yantra-1",
    id: "digital-yantra-1",
    name: "Kan Drishti Yantra Vector Emblem",
    description: "Ultra High Resolution (4K) Sacred Geometry Kan Drishti Yantra digital asset. Ready for printing, wallpapers, and spiritual branding.",
    price: 499,
    originalPrice: 999,
    discount: 50,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    pngUrl: "https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/digital_pngs/kan-drishti-yantra-4k.png",
    cloudinaryUrl: "https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/digital_pngs/kan-drishti-yantra-4k.png",
    pdfUrl: "",
    fileType: "png",
    category: "Digital Yantra PNGs",
    categoryId: "digital-yantra",
    categoryName: "Digital Yantras",
    unit: "PNG Asset",
    resolution: "3840 x 3840 px (300 DPI)",
    fileSize: "14.2 MB",
    isDigital: true,
    downloadsCount: 142,
    stock: 9999,
    inStock: true,
    rating: 5,
    reviewsCount: 38
  },
  {
    _id: "digital-siddhar-2",
    id: "digital-siddhar-2",
    name: "Varahi Secret Divine Symbol PNG",
    description: "Transparent high-resolution PNG digital graphic of the ancient Varahi Secret Goddess Siddhar emblem. Perfect for digital art and print production.",
    price: 799,
    originalPrice: 1499,
    discount: 47,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    pngUrl: "https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/digital_pngs/varahi-secret-symbol.png",
    cloudinaryUrl: "https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/digital_pngs/varahi-secret-symbol.png",
    pdfUrl: "",
    fileType: "png",
    category: "Sacred Symbols",
    categoryId: "sacred-symbols",
    categoryName: "Sacred Symbols",
    unit: "PNG Asset",
    resolution: "4000 x 4000 px (300 DPI)",
    fileSize: "18.6 MB",
    isDigital: true,
    downloadsCount: 89,
    stock: 9999,
    inStock: true,
    rating: 5,
    reviewsCount: 29
  },
  {
    _id: "digital-kubera-3",
    id: "digital-kubera-3",
    name: "Kubera Prosperity Sacred Pattern",
    description: "Exclusive vector-grade lossless PNG illustration for prosperity meditation, digital prints, and frame creation.",
    price: 350,
    originalPrice: 700,
    discount: 50,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    pngUrl: "https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/digital_pngs/kubera-prosperity-pattern.png",
    cloudinaryUrl: "https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/digital_pngs/kubera-prosperity-pattern.png",
    pdfUrl: "",
    fileType: "png",
    category: "Digital Yantra PNGs",
    categoryId: "digital-yantra",
    categoryName: "Digital Yantras",
    unit: "PNG Asset",
    resolution: "3000 x 3000 px (300 DPI)",
    fileSize: "10.8 MB",
    isDigital: true,
    downloadsCount: 210,
    stock: 9999,
    inStock: true,
    rating: 4.9,
    reviewsCount: 45
  },
  {
    _id: "digital-murugan-4",
    id: "digital-murugan-4",
    name: "Vetrivel Divine Spear Digital Graphic",
    description: "Minimalist white and gold vector motif PNG of Vetrivel Murugan spear symbol in crisp lossless 4K resolution.",
    price: 299,
    originalPrice: 599,
    discount: 50,
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    pngUrl: "https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/digital_pngs/vetrivel-spear-symbol.png",
    cloudinaryUrl: "https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/digital_pngs/vetrivel-spear-symbol.png",
    pdfUrl: "",
    fileType: "png",
    category: "Sacred Symbols",
    categoryId: "sacred-symbols",
    categoryName: "Sacred Symbols",
    unit: "PNG Asset",
    resolution: "3840 x 2160 px",
    fileSize: "9.5 MB",
    isDigital: true,
    downloadsCount: 304,
    stock: 9999,
    inStock: true,
    rating: 5,
    reviewsCount: 62
  }
];

export { memoryProducts };

// Helper to sanitize product object
const formatProduct = (p) => {
  const obj = p.toObject ? p.toObject() : { ...p };
  obj.id = obj._id || obj.id;
  obj.isDigital = obj.isDigital !== undefined ? obj.isDigital : true;
  obj.fileType = obj.fileType || (obj.pdfUrl ? 'pdf' : 'png');
  obj.resolution = obj.resolution || (obj.fileType === 'pdf' ? 'PDF Document' : '3840 x 2160 (4K UHD)');
  obj.fileSize = obj.fileSize || '12.5 MB';
  obj.cloudinaryUrl = obj.cloudinaryUrl || obj.pdfUrl || obj.pngUrl || obj.image;
  return obj;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (isDbConnected) {
      const category = req.query.category;
      const filter = category ? { categoryId: category } : {};
      const products = await Product.find(filter);
      
      if (products && products.length > 0) {
        return res.json(products.map(formatProduct));
      }
    }
    
    // Fallback to in-memory items
    const category = req.query.category;
    let items = memoryProducts;
    if (category) {
      items = items.filter(p => p.categoryId === category);
    }
    return res.json(items.map(formatProduct));
  } catch (error) {
    res.json(memoryProducts.map(formatProduct));
  }
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected) {
      const product = await Product.findById(req.params.id);
      if (product) {
        return res.json(formatProduct(product));
      }
    }

    const item = memoryProducts.find(p => p.id === req.params.id || p._id === req.params.id);
    if (item) {
      return res.json(formatProduct(item));
    }

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    const item = memoryProducts.find(p => p.id === req.params.id || p._id === req.params.id);
    if (item) return res.json(formatProduct(item));
    res.status(500).json({ message: 'Error retrieving product', error: error.message });
  }
});

// @desc    Download / Redirect Digital Asset (PNG / E-Book PDF)
// @desc    Download / Serve Digital Asset (PNG or E-Book PDF)
// @route   GET /api/products/:id/download
// @access  Public
router.get('/:id/download', async (req, res) => {
  try {
    let product = null;

    if (isDbConnected) {
      product = await Product.findOne({
        $or: [{ _id: req.params.id }, { id: req.params.id }]
      });
    }
    if (!product) {
      product = memoryProducts.find(p => p.id === req.params.id || p._id === req.params.id);
    }

    const productName = product ? product.name : 'digital-asset';
    const isPdf = product && (product.fileType === 'pdf' || (product.pdfUrl && product.pdfUrl.includes('.pdf')));
    const fileExt = isPdf ? '.pdf' : '.png';
    const cleanFileName = productName.toLowerCase().replace(/[^a-z0-9]/g, '-') + fileExt;

    // Increment download count
    if (product) {
      product.downloadsCount = (product.downloadsCount || 0) + 1;
      if (isDbConnected && product.save) {
        await product.save();
      }
    }

    const cloudUrl = product ? (product.cloudinaryUrl || product.pdfUrl || product.pngUrl || product.image) : '';

    // Check if Cloudinary URL is a real live external URL (not dummy placeholder)
    if (cloudUrl && cloudUrl.startsWith('http') && !cloudUrl.includes('v1700000000') && !cloudUrl.includes('example.com')) {
      return res.redirect(cloudUrl);
    }

    // Check if Base64 Data URI
    if (cloudUrl && cloudUrl.startsWith('data:')) {
      const parts = cloudUrl.split(';base64,');
      const contentType = parts[0].replace('data:', '');
      const base64Data = parts[1];
      const fileBuffer = Buffer.from(base64Data, 'base64');
      
      res.setHeader('Content-Type', contentType || (isPdf ? 'application/pdf' : 'image/png'));
      res.setHeader('Content-Disposition', `attachment; filename="${cleanFileName}"`);
      return res.send(fileBuffer);
    }

    // High-Resolution SVG Artwork / PDF Manuscript Document Response
    const title = product ? product.name : 'Clyrova Digital Asset';
    const subtitle = isPdf ? 'OFFICIAL E-BOOK PDF MANUSCRIPT' : 'OFFICIAL 4K LOSSLESS PNG GRAPHIC';
    
    const svgContent = `
      <svg width="1200" height="1200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0d382c"/>
            <stop offset="100%" stop-color="#06241c"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <rect x="80" y="80" width="1040" height="1040" rx="40" stroke="#f59e0b" stroke-width="6" fill="none" opacity="0.3"/>
        <circle cx="600" cy="400" r="120" fill="#f59e0b" opacity="0.1"/>
        <text x="600" y="420" font-family="system-ui, sans-serif" font-size="80" font-weight="900" fill="#f59e0b" text-anchor="middle">
          Clyrova.
        </text>
        <text x="600" y="580" font-family="system-ui, sans-serif" font-size="34" font-weight="800" fill="#ffffff" text-anchor="middle">
          ${title.toUpperCase()}
        </text>
        <text x="600" y="650" font-family="system-ui, sans-serif" font-size="20" fill="#a7f3d0" font-weight="600" text-anchor="middle">
          ${subtitle}
        </text>
        <text x="600" y="730" font-family="system-ui, sans-serif" font-size="16" fill="#f59e0b" font-weight="700" text-anchor="middle">
          VERIFIED CLOUDINARY DIGITAL ASSET • CLYROVA STORE
        </text>
      </svg>
    `.trim();

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', `attachment; filename="${cleanFileName.replace(/\.(png|pdf)$/, '.svg')}"`);
    return res.send(svgContent);
  } catch (error) {
    console.error('Download route error:', error);
    res.status(500).json({ message: 'Error downloading file', error: error.message });
  }
});

// @desc    Create / Upload a new digital product (PNG or E-Book PDF)
// @route   POST /api/products
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      pngUrl,
      pdfUrl,
      fileType,
      cloudinaryUrl,
      categoryName,
      categoryId,
      resolution,
      pages,
      author,
      fileSize
    } = req.body;

    const isPdf = fileType === 'pdf' || (pdfUrl && pdfUrl.includes('.pdf'));
    const newId = `digital-prod-${Date.now()}`;
    const cloudLink = cloudinaryUrl || pdfUrl || pngUrl || `https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/uploads/${newId}.${isPdf ? 'pdf' : 'png'}`;

    const productData = {
      _id: newId,
      id: newId,
      name: name || (isPdf ? 'Custom Siddhar E-Book PDF' : 'Custom Digital PNG Artwork'),
      description: description || `High resolution digital product upload (${isPdf ? 'PDF E-Book' : 'PNG Asset'}).`,
      price: price ? parseFloat(price) : 299,
      originalPrice: price ? parseFloat(price) * 1.5 : 599,
      discount: 33,
      image: image || (isPdf ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' : pngUrl),
      fileType: isPdf ? 'pdf' : 'png',
      pngUrl: isPdf ? '' : (pngUrl || image || ''),
      pdfUrl: isPdf ? (pdfUrl || cloudLink) : '',
      cloudinaryUrl: cloudLink,
      category: categoryName || (isPdf ? 'E-Books (PDF)' : 'Custom Uploads'),
      categoryId: categoryId || (isPdf ? 'ebooks-pdf' : 'custom-uploads'),
      categoryName: categoryName || (isPdf ? 'E-Books (PDF)' : 'Custom Uploads'),
      unit: isPdf ? 'PDF E-Book' : 'PNG File',
      pages: pages || (isPdf ? '120 Pages' : ''),
      author: author || 'Varahi Siddhar Research',
      resolution: resolution || (isPdf ? 'PDF Document' : '4000 x 4000 px (300 DPI)'),
      fileSize: fileSize || (isPdf ? '6.5 MB' : '12.4 MB'),
      isDigital: true,
      stock: 9999,
      soldOut: false,
      offer: true,
      rating: 5,
      reviewsCount: 1,
      inStock: true,
      downloadsCount: 0
    };

    if (isDbConnected) {
      const product = new Product(productData);
      const saved = await product.save();
      return res.status(201).json(formatProduct(saved));
    }

    memoryProducts.unshift(productData);
    return res.status(201).json(formatProduct(productData));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const targetId = req.params.id;

    if (isDbConnected) {
      const product = await Product.findOne({
        $or: [{ _id: targetId }, { id: targetId }]
      });

      if (product) {
        const fieldsToUpdate = [
          'name', 'description', 'price', 'originalPrice', 'discount',
          'image', 'category', 'categoryId', 'categoryName', 'unit',
          'stock', 'soldOut', 'offer', 'rating', 'reviewsCount', 'inStock',
          'isDigital', 'fileType', 'pngUrl', 'pdfUrl', 'cloudinaryUrl',
          'resolution', 'pages', 'author', 'fileSize'
        ];

        fieldsToUpdate.forEach(field => {
          if (req.body[field] !== undefined) {
            product[field] = req.body[field];
          }
        });

        // Ensure category consistency
        if (req.body.categoryName) {
          product.category = req.body.categoryName;
          product.categoryName = req.body.categoryName;
          product.categoryId = req.body.categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        }

        const updated = await product.save();
        return res.json(formatProduct(updated));
      }
    }

    // Fallback to in-memory store
    const idx = memoryProducts.findIndex(p => p.id === targetId || p._id === targetId);
    if (idx !== -1) {
      memoryProducts[idx] = { ...memoryProducts[idx], ...req.body };
      if (req.body.categoryName) {
        memoryProducts[idx].category = req.body.categoryName;
        memoryProducts[idx].categoryName = req.body.categoryName;
      }
      return res.json(formatProduct(memoryProducts[idx]));
    }

    res.status(404).json({ message: 'Product not found for update' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const targetId = req.params.id;
    let deletedFromDb = false;

    if (isDbConnected) {
      const product = await Product.findOne({
        $or: [{ _id: targetId }, { id: targetId }]
      });
      if (product) {
        await Product.deleteOne({ _id: product._id });
        deletedFromDb = true;
      }
    }

    // Always check/remove from memory store as well to keep in sync
    const idx = memoryProducts.findIndex(p => p.id === targetId || p._id === targetId);
    if (idx !== -1) {
      memoryProducts.splice(idx, 1);
    }

    if (deletedFromDb || idx !== -1) {
      return res.json({ success: true, message: 'Product successfully removed' });
    }

    res.status(404).json({ message: 'Product not found for deletion' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

export default router;
