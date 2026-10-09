import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: ''
  },
  categoryId: {
    type: String,
    required: true
  },
  categoryName: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    default: '1 Nos'
  },
  stock: {
    type: Number,
    default: 50
  },
  soldOut: {
    type: Boolean,
    default: false
  },
  offer: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  isDigital: {
    type: Boolean,
    default: true
  },
  fileType: {
    type: String,
    enum: ['png', 'pdf', 'image', 'ebook'],
    default: 'png'
  },
  pngUrl: {
    type: String,
    default: ''
  },
  pdfUrl: {
    type: String,
    default: ''
  },
  cloudinaryUrl: {
    type: String,
    default: ''
  },
  resolution: {
    type: String,
    default: '3840 x 2160 (4K UHD PNG)'
  },
  pages: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: 'Siddhar Heritage'
  },
  fileSize: {
    type: String,
    default: '12.4 MB'
  },
  downloadsCount: {
    type: Number,
    default: 0
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true,
  _id: false // Disable auto-generated ObjectId to use our explicit String _id
});

const Product = mongoose.model('Product', productSchema);

export default Product;
