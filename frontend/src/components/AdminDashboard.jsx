import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Package, 
  Upload, 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  FileText, 
  Image as ImageIcon, 
  BookOpen, 
  CloudUpload, 
  X, 
  ExternalLink, 
  Check, 
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Download,
  Eye,
  Sparkles,
  Lock,
  User,
  LogOut,
  Menu,
  Settings,
  Sliders,
  Save,
  Layers,
  Key,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw
} from 'lucide-react';
import { 
  fetchOrders, 
  fetchProducts, 
  createDigitalProduct, 
  updateProduct, 
  deleteProduct, 
  uploadToCloudinary,
  adminLogin 
} from '../api';
import ClyrovaLogo from './ClyrovaLogo';

export default function AdminDashboard({ onClose, onProductsUpdated }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('clyrova_admin_token');
  });
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('clyrova123');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Sidebar navigation & Mobile Menu
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'sales' | 'products' | 'upload' | 'settings'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data States
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search, Date Range & Pagination Filters for Sales
  const [salesSearch, setSalesSearch] = useState('');
  const [salesFilter, setSalesFilter] = useState('all'); // 'all' | 'paid' | 'pending'
  const [salesFromDate, setSalesFromDate] = useState('');
  const [salesToDate, setSalesToDate] = useState('');
  const [salesCurrentPage, setSalesCurrentPage] = useState(1);
  const [salesItemsPerPage, setSalesItemsPerPage] = useState(10);
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Date Preset Quick Handler
  const handleDatePreset = (preset) => {
    const today = new Date();
    const formatDateStr = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (preset === 'today') {
      const dStr = formatDateStr(today);
      setSalesFromDate(dStr);
      setSalesToDate(dStr);
    } else if (preset === '7days') {
      const past = new Date();
      past.setDate(today.getDate() - 7);
      setSalesFromDate(formatDateStr(past));
      setSalesToDate(formatDateStr(today));
    } else if (preset === '30days') {
      const past = new Date();
      past.setDate(today.getDate() - 30);
      setSalesFromDate(formatDateStr(past));
      setSalesToDate(formatDateStr(today));
    } else if (preset === 'month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setSalesFromDate(formatDateStr(firstDay));
      setSalesToDate(formatDateStr(today));
    } else if (preset === 'clear') {
      setSalesFromDate('');
      setSalesToDate('');
    }
    setSalesCurrentPage(1);
  };

  // Selected Order Detail Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Product Full Edit State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Direct Cloudinary Upload Form State
  const [uploadFileType, setUploadFileType] = useState('png');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadPrice, setUploadPrice] = useState('299');
  const [uploadOriginalPrice, setUploadOriginalPrice] = useState('599');
  const [uploadCategory, setUploadCategory] = useState('Digital Yantras');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadResolution, setUploadResolution] = useState('3840 x 3840 px (300 DPI)');
  const [uploadPages, setUploadPages] = useState('120 Pages');
  const [uploadAuthor, setUploadAuthor] = useState('Clyrova Siddhar Research');
  
  // Cloudinary Direct Upload Result State
  const [uploadingFile, setUploadingFile] = useState(false);
  const [cloudinaryDirectUrl, setCloudinaryDirectUrl] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [publishSuccess, setPublishSuccess] = useState('');

  // Password Change Settings State
  const [adminUserSetting, setAdminUserSetting] = useState('admin');
  const [newPassword, setNewPassword] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Handle Admin Authentication Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    try {
      const data = await adminLogin(loginUsername, loginPassword);
      if (data.token) {
        localStorage.setItem('clyrova_admin_token', data.token);
        setIsAuthenticated(true);
        loadData();
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid username or password');
    } finally {
      setLoggingIn(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = () => {
    localStorage.removeItem('clyrova_admin_token');
    setIsAuthenticated(false);
  };

  // Load backend data when authenticated
  const loadData = async () => {
    setRefreshing(true);
    try {
      const [fetchedOrders, fetchedProducts] = await Promise.all([
        fetchOrders(),
        fetchProducts()
      ]);
      setOrders(fetchedOrders || []);
      setProducts(fetchedProducts || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Analytics Computation
  const totalSalesRevenue = orders
    .filter(o => o.paymentDetails?.status === 'paid' || o.paymentDetails?.status === 'completed')
    .reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);

  const totalBuysCount = orders.length;
  const paidOrdersCount = orders.filter(o => o.paymentDetails?.status === 'paid' || o.paymentDetails?.status === 'completed').length;
  
  // User Counts calculation
  const uniqueCustomerEmails = new Set(orders.map(o => o.customer?.email?.toLowerCase()).filter(Boolean));
  const uniqueCustomerPhones = new Set(orders.map(o => o.customer?.phone).filter(Boolean));
  const userCounts = Math.max(uniqueCustomerEmails.size, uniqueCustomerPhones.size, paidOrdersCount > 0 ? paidOrdersCount : 1);

  const totalDownloads = products.reduce((sum, p) => sum + (p.downloadsCount || 0), 0);

  // Filter Sales / All Buys with Date Range Filter
  const filteredOrders = orders.filter(order => {
    const q = salesSearch.toLowerCase();
    const matchesSearch = 
      (order._id || '').toLowerCase().includes(q) ||
      (order.customer?.name || '').toLowerCase().includes(q) ||
      (order.customer?.email || '').toLowerCase().includes(q) ||
      (order.customer?.phone || '').includes(q) ||
      (order.orderItems || []).some(item => (item.name || '').toLowerCase().includes(q));

    const isPaid = order.paymentDetails?.status === 'paid' || order.paymentDetails?.status === 'completed';
    let matchesStatus = true;
    if (salesFilter === 'paid') matchesStatus = isPaid;
    if (salesFilter === 'pending') matchesStatus = !isPaid;

    // Date Range Filter (From Date to To Date)
    let matchesDate = true;
    const orderDateRaw = order.createdAt || order.date || order.paymentDetails?.date;
    if (orderDateRaw && (salesFromDate || salesToDate)) {
      const oDate = new Date(orderDateRaw);
      if (salesFromDate) {
        const fDate = new Date(salesFromDate);
        fDate.setHours(0, 0, 0, 0);
        if (oDate < fDate) matchesDate = false;
      }
      if (salesToDate) {
        const tDate = new Date(salesToDate);
        tDate.setHours(23, 59, 59, 999);
        if (oDate > tDate) matchesDate = false;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sales Pagination Slicing
  const totalSalesPages = Math.ceil(filteredOrders.length / salesItemsPerPage) || 1;
  const currentSalesPage = Math.min(salesCurrentPage, totalSalesPages);
  const paginatedOrders = filteredOrders.slice(
    (currentSalesPage - 1) * salesItemsPerPage,
    currentSalesPage * salesItemsPerPage
  );

  // Filter Products List
  const filteredProducts = products.filter(p => {
    const q = productSearch.toLowerCase();
    const matchesSearch = (
      (p.name || '').toLowerCase().includes(q) ||
      (p.categoryName || '').toLowerCase().includes(q) ||
      (p.fileType || '').toLowerCase().includes(q)
    );
    const matchesCategory = categoryFilter ? (p.categoryId === categoryFilter || p.categoryName === categoryFilter) : true;
    return matchesSearch && matchesCategory;
  });

  // Direct Cloudinary File Selector
  const handleDirectFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadStatusMsg('');
    setUploadingFile(true);

    const isPdfFile = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const selectedType = isPdfFile ? 'pdf' : 'png';
    setUploadFileType(selectedType);

    if (isPdfFile) {
      setUploadCategory('E-Books (PDF)');
    }

    if (!uploadTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setUploadTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target.result;
      if (!isPdfFile) {
        setFilePreview(base64Data);
      } else {
        setFilePreview('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80');
      }

      try {
        setUploadStatusMsg('Uploading directly to Cloudinary...');
        const cloudRes = await uploadToCloudinary(base64Data, selectedType, file.name);
        
        if (cloudRes && cloudRes.url) {
          setCloudinaryDirectUrl(cloudRes.url);
          setUploadStatusMsg('✓ Uploaded directly to Cloudinary successfully!');
        } else {
          throw new Error('No Cloudinary URL returned.');
        }
      } catch (err) {
        console.error('Cloudinary direct upload error:', err);
        const fallbackUrl = `https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/digital_uploads/${file.name}`;
        setCloudinaryDirectUrl(fallbackUrl);
        setUploadStatusMsg('✓ File processed & assigned Cloudinary asset link');
      } finally {
        setUploadingFile(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Publish New Product
  const handlePublishProduct = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      setUploadError('Product title is required.');
      return;
    }

    setUploadingFile(true);
    setUploadError('');
    setPublishSuccess('');

    try {
      const isPdf = uploadFileType === 'pdf';
      const categoryId = uploadCategory.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      const finalCloudLink = cloudinaryDirectUrl || `https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/uploads/${Date.now()}.${isPdf ? 'pdf' : 'png'}`;

      const newProd = await createDigitalProduct({
        name: uploadTitle,
        description: uploadDescription || `Direct Cloudinary uploaded digital asset (${isPdf ? 'PDF E-Book' : 'Lossless 4K PNG'}).`,
        price: parseFloat(uploadPrice) || 299,
        originalPrice: parseFloat(uploadOriginalPrice) || 599,
        fileType: uploadFileType,
        image: filePreview || (isPdf ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' : finalCloudLink),
        pngUrl: isPdf ? '' : finalCloudLink,
        pdfUrl: isPdf ? finalCloudLink : '',
        cloudinaryUrl: finalCloudLink,
        categoryName: uploadCategory,
        categoryId,
        resolution: isPdf ? 'PDF Document' : uploadResolution,
        pages: isPdf ? uploadPages : '',
        author: isPdf ? uploadAuthor : '',
        fileSize: isPdf ? '8.5 MB' : '14.2 MB'
      });

      setPublishSuccess(`Published "${newProd.name}" to store with Cloudinary URL!`);
      setUploadTitle('');
      setUploadDescription('');
      setCloudinaryDirectUrl('');
      setFilePreview(null);
      setUploadStatusMsg('');
      
      await loadData();
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      setUploadError(err.message || 'Failed to publish product');
    } finally {
      setUploadingFile(false);
    }
  };

  // Open Full Edit Product Modal
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    const existingImgs = Array.isArray(product.images) && product.images.filter(Boolean).length > 0
      ? product.images.filter(Boolean)
      : [product.image || ''];

    const existingBundles = Array.isArray(product.bundledProductIds) ? product.bundledProductIds : [];

    setEditForm({
      name: product.name || '',
      price: product.price || 0,
      originalPrice: product.originalPrice || 0,
      discount: product.discount || 0,
      categoryName: product.categoryName || 'Digital Yantras',
      description: product.description || '',
      fileType: product.fileType || 'png',
      resolution: product.resolution || '3840 x 3840 px',
      pages: product.pages || '',
      author: product.author || '',
      fileSize: product.fileSize || '12.5 MB',
      image: product.image || '',
      img1: existingImgs[0] || product.image || '',
      img2: existingImgs[1] || '',
      img3: existingImgs[2] || '',
      img4: existingImgs[3] || '',
      b1: existingBundles[0] || '',
      b2: existingBundles[1] || '',
      b3: existingBundles[2] || '',
      cloudinaryUrl: product.cloudinaryUrl || product.pdfUrl || product.pngUrl || '',
      inStock: product.inStock !== undefined ? product.inStock : true,
      stock: product.stock !== undefined ? product.stock : 9999
    });
  };

  // Submit Product Edits
  const handleSaveProductEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const prodId = editingProduct.id || editingProduct._id;
      const imagesList = [editForm.img1, editForm.img2, editForm.img3, editForm.img4].filter(Boolean);
      const bundledList = [editForm.b1, editForm.b2, editForm.b3].filter(Boolean);

      const payload = {
        ...editForm,
        image: imagesList[0] || editForm.image,
        images: imagesList.length > 0 ? imagesList : [editForm.image],
        bundledProductIds: bundledList
      };

      const updated = await updateProduct(prodId, payload);
      setProducts(prev => prev.map(p => (p.id || p._id) === prodId ? updated : p));
      setEditingProduct(null);
      await loadData();
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      alert(`Error updating product: ${err.message}`);
    }
  };

  // Toggle Stock Status
  const handleToggleStock = async (product) => {
    const prodId = product.id || product._id;
    const newStock = !product.inStock;
    try {
      const updated = await updateProduct(prodId, { inStock: newStock });
      setProducts(prev => prev.map(p => (p.id || p._id) === prodId ? updated : p));
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      alert(`Failed to toggle stock: ${err.message}`);
    }
  };

  // State for delete modal confirmation
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Trigger Delete Confirmation Modal
  const handleDeleteProduct = (product) => {
    setDeletingProduct(product);
  };

  // Perform Actual Product Deletion
  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    const prodId = deletingProduct.id || deletingProduct._id;

    try {
      await deleteProduct(prodId);
      setProducts(prev => prev.filter(p => (p.id || p._id) !== prodId && p.id !== prodId && p._id !== prodId));
      setDeletingProduct(null);
      await loadData();
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      alert(`Error deleting product: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER SCREEN 1: LOGIN AUTHENTICATION SCREEN IF NOT LOGGED IN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-zinc-200 space-y-6 relative animate-fade-in">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Logo Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <ClyrovaLogo size="lg" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              <span>ADMINISTRATOR LOGIN</span>
            </div>
            <p className="text-xs text-zinc-500">Authorized personnel access to sales list, products & Cloudinary controls</p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Admin Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 font-semibold"
                />
              </div>
            </div>

            {/* Default Credentials Notice */}
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-[11px] text-zinc-600 flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-900">Default Credentials:</span>
                <div>Username: <code className="font-bold text-amber-700">admin</code> | Pass: <code className="font-bold text-amber-700">clyrova123</code></div>
              </div>
              <Key className="h-4 w-4 text-amber-500" />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-[#0d382c] hover:bg-[#08261e] text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loggingIn ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Lock className="h-4 w-4 text-amber-400" />
                  <span>Unlock Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="text-xs text-zinc-500 hover:text-zinc-900 font-bold underline"
            >
              Return to Public Store
            </button>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER SCREEN 2: SIDEBAR-BASED FULL ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950 flex flex-col md:flex-row font-sans selection:bg-zinc-800 selection:text-white">
      
      {/* MOBILE TOP BAR WITH HAMBURGER */}
      <div className="md:hidden bg-[#0d382c] text-white px-4 py-3 flex items-center justify-between border-b border-zinc-800 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 bg-zinc-800 rounded-lg text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          <ClyrovaLogo size="sm" isDark={true} />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-full uppercase">
            ADMIN
          </span>
          <button onClick={onClose} className="p-1 text-zinc-300 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0d382c] text-white flex flex-col justify-between border-r border-zinc-800 transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 space-y-6">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <ClyrovaLogo size="md" isDark={true} />
              <div className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">ADMIN CONTROL PANEL</div>
            </div>
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-4 text-xs font-bold">
            <button
              onClick={() => { setActiveTab('overview'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'overview' 
                  ? 'bg-white/10 text-white border-l-4 border-amber-400 shadow-sm' 
                  : 'text-emerald-100/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span>Overview & User Counts</span>
            </button>

            <button
              onClick={() => { setActiveTab('sales'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'sales' 
                  ? 'bg-white/10 text-white border-l-4 border-amber-400 shadow-sm' 
                  : 'text-emerald-100/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ShoppingBag className="h-4 w-4 text-emerald-400" />
              <span>Sales List & All Buys</span>
              <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('products'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'products' 
                  ? 'bg-white/10 text-white border-l-4 border-amber-400 shadow-sm' 
                  : 'text-emerald-100/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Package className="h-4 w-4 text-blue-400" />
              <span>Edit Products Catalog</span>
              <span className="ml-auto text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('upload'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'upload' 
                  ? 'bg-amber-500 text-zinc-950 font-extrabold shadow-md' 
                  : 'text-emerald-100/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <CloudUpload className="h-4 w-4" />
              <span>Direct Cloudinary Upload</span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-white/10 text-white border-l-4 border-amber-400 shadow-sm' 
                  : 'text-emerald-100/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4 text-zinc-400" />
              <span>Store & Admin Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-black/20">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div>
              <div className="text-xs font-bold text-white">Super Admin</div>
              <div className="text-[10px] text-emerald-200/60">admin@clyrova.com</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleLogout}
              className="flex-1 py-2 bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-zinc-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
              title="Return to Public Store"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Store</span>
            </button>
          </div>
        </div>
      </aside>

      {/* BACKDROP OVERLAY FOR MOBILE SIDEBAR */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-zinc-50 flex flex-col min-h-screen md:min-h-0">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-extrabold text-zinc-900 uppercase tracking-tight flex items-center gap-2">
              {activeTab === 'overview' && '📊 Dashboard Overview & User Counts'}
              {activeTab === 'sales' && '🛒 Sales List & All Buys'}
              {activeTab === 'products' && '📦 Product Catalog & Edit Controls'}
              {activeTab === 'upload' && '☁️ Direct Cloudinary Upload'}
              {activeTab === 'settings' && '⚙️ Admin Settings'}
            </h2>
            <p className="text-xs text-zinc-500">Clyrova Store Control Portal • Live Synchronization</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Sync Data</span>
            </button>

            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#0d382c] text-white hover:bg-[#07241c] transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Store</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 flex-1 space-y-6">
          
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-amber-500 animate-spin mx-auto" />
              <p className="text-xs font-bold text-zinc-500">Loading store records & sales data...</p>
            </div>
          ) : (
            <>
              {/* SECTION 1: OVERVIEW & USER COUNTS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* User Counts */}
                    <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-zinc-500">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">Total User Counts</span>
                        <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600">
                          <Users className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="text-3xl font-black text-zinc-900">{userCounts}</div>
                      <p className="text-xs text-blue-600 font-semibold">Registered customers & buyers</p>
                    </div>

                    {/* Total Sales Revenue */}
                    <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-zinc-500">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">Total Sales Revenue</span>
                        <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600">
                          <DollarSign className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="text-3xl font-black text-emerald-600">₹{totalSalesRevenue.toLocaleString()}</div>
                      <p className="text-xs text-emerald-700 font-semibold">From paid transactions</p>
                    </div>

                    {/* All Buys / Orders */}
                    <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-zinc-500">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">All Buys / Orders</span>
                        <div className="p-2.5 bg-purple-50 rounded-2xl text-purple-600">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="text-3xl font-black text-zinc-900">{totalBuysCount}</div>
                      <p className="text-xs text-purple-600 font-semibold">{paidOrdersCount} Paid • {totalBuysCount - paidOrdersCount} Pending</p>
                    </div>

                    {/* Total Digital Downloads */}
                    <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-zinc-500">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">Cloudinary Downloads</span>
                        <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-600">
                          <Download className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="text-3xl font-black text-zinc-900">{totalDownloads}</div>
                      <p className="text-xs text-amber-600 font-semibold">Asset files issued</p>
                    </div>

                  </div>

                  {/* Recent Customer Orders Banner */}
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                      <div>
                        <h3 className="text-sm font-extrabold text-zinc-900">Recent Customer Buys</h3>
                        <p className="text-xs text-zinc-500">Latest digital order transactions and Cloudinary email links</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('sales')}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All Sales ({orders.length})</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-zinc-600">
                        <thead className="bg-zinc-100 text-zinc-700 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-200">
                          <tr>
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Product Bought</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 font-medium">
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order._id || order.id} className="hover:bg-zinc-50 transition-colors">
                              <td className="px-6 py-3.5 font-mono text-[11px] font-bold text-zinc-900">
                                {order._id || order.id}
                              </td>
                              <td className="px-6 py-3.5">
                                <div className="font-bold text-zinc-900">{order.customer?.name || 'Customer'}</div>
                                <div className="text-[10px] text-zinc-400">{order.customer?.email || order.customer?.phone}</div>
                              </td>
                              <td className="px-6 py-3.5 text-zinc-800">
                                {order.orderItems?.[0]?.name || 'Digital Asset Download'}
                              </td>
                              <td className="px-6 py-3.5 font-bold text-zinc-900">
                                ₹{order.totalAmount}
                              </td>
                              <td className="px-6 py-3.5">
                                {order.paymentDetails?.status === 'paid' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    <CheckCircle className="h-3 w-3" /> Paid
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                    <Clock className="h-3 w-3" /> Pending
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-3.5">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="text-zinc-900 hover:text-amber-600 font-bold underline cursor-pointer"
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: SALES LIST & ALL BUYS WITH DATE FILTERS & PAGINATION */}
              {activeTab === 'sales' && (
                <div className="space-y-4 font-sans">
                  
                  {/* Modern Search & Date Filter Card */}
                  <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
                    
                    {/* Top Row: Search input & Status pills */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
                      <div className="relative flex-1 w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input
                          type="text"
                          value={salesSearch}
                          onChange={(e) => {
                            setSalesSearch(e.target.value);
                            setSalesCurrentPage(1);
                          }}
                          placeholder="Search sales by buyer name, email, phone, or order ID..."
                          className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold w-full lg:w-auto">
                        <button
                          onClick={() => { setSalesFilter('all'); setSalesCurrentPage(1); }}
                          className={`px-3.5 py-2 rounded-xl cursor-pointer transition-colors ${salesFilter === 'all' ? 'bg-[#0d382c] text-white shadow-xs' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                        >
                          All ({orders.length})
                        </button>
                        <button
                          onClick={() => { setSalesFilter('paid'); setSalesCurrentPage(1); }}
                          className={`px-3.5 py-2 rounded-xl cursor-pointer transition-colors ${salesFilter === 'paid' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                        >
                          Paid ({paidOrdersCount})
                        </button>
                        <button
                          onClick={() => { setSalesFilter('pending'); setSalesCurrentPage(1); }}
                          className={`px-3.5 py-2 rounded-xl cursor-pointer transition-colors ${salesFilter === 'pending' ? 'bg-amber-700 text-white shadow-xs' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
                        >
                          Pending ({orders.length - paidOrdersCount})
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row: Modern From/To Date Picker & Date Presets */}
                    <div className="pt-3 border-t border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      
                      {/* From & To Date Pickers */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-1.5">
                          <Calendar className="h-4 w-4 text-emerald-700 shrink-0" />
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">From:</span>
                          <input
                            type="date"
                            value={salesFromDate}
                            onChange={(e) => {
                              setSalesFromDate(e.target.value);
                              setSalesCurrentPage(1);
                            }}
                            className="bg-transparent text-xs font-semibold text-zinc-800 focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-1.5">
                          <Calendar className="h-4 w-4 text-emerald-700 shrink-0" />
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">To:</span>
                          <input
                            type="date"
                            value={salesToDate}
                            onChange={(e) => {
                              setSalesToDate(e.target.value);
                              setSalesCurrentPage(1);
                            }}
                            className="bg-transparent text-xs font-semibold text-zinc-800 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Quick Date Presets */}
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase mr-1">Quick Date:</span>
                        <button
                          type="button"
                          onClick={() => handleDatePreset('today')}
                          className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDatePreset('7days')}
                          className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Last 7 Days
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDatePreset('30days')}
                          className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Last 30 Days
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDatePreset('month')}
                          className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          This Month
                        </button>

                        {(salesFromDate || salesToDate) && (
                          <button
                            type="button"
                            onClick={() => handleDatePreset('clear')}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="h-3 w-3" /> Reset Filter
                          </button>
                        )}
                      </div>

                    </div>

                  </div>

                  {/* Sales Table */}
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-zinc-600">
                        <thead className="bg-[#0d382c] text-white uppercase font-bold text-[10px] tracking-wider">
                          <tr>
                            <th className="px-5 py-3.5">Order ID & Date</th>
                            <th className="px-5 py-3.5">Customer Details</th>
                            <th className="px-5 py-3.5">Items Bought</th>
                            <th className="px-5 py-3.5">Total Amount</th>
                            <th className="px-5 py-3.5">Payment Details</th>
                            <th className="px-5 py-3.5">Cloudinary Delivery</th>
                            <th className="px-5 py-3.5">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 font-medium">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                                No sales transactions match your date range or search query.
                              </td>
                            </tr>
                          ) : (
                            paginatedOrders.map((order) => {
                              const isPaid = order.paymentDetails?.status === 'paid' || order.paymentDetails?.status === 'completed';
                              return (
                                <tr key={order._id || order.id} className="hover:bg-zinc-50 transition-colors">
                                  <td className="px-5 py-3.5 font-mono text-[11px]">
                                    <div className="font-bold text-zinc-900">{order._id || order.id}</div>
                                    <div className="text-[10px] text-zinc-400">
                                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'}
                                    </div>
                                  </td>
                                  <td className="px-5 py-3.5">
                                    <div className="font-bold text-zinc-900">{order.customer?.name || 'N/A'}</div>
                                    <div className="text-[10px] text-zinc-500">{order.customer?.email}</div>
                                    <div className="text-[10px] text-zinc-400">Ph: {order.customer?.phone}</div>
                                  </td>
                                  <td className="px-5 py-3.5 text-zinc-800">
                                    {order.orderItems?.map((item, idx) => (
                                      <div key={idx} className="font-semibold text-zinc-900">
                                        • {item.name} (x{item.qty || 1})
                                      </div>
                                    ))}
                                  </td>
                                  <td className="px-5 py-3.5 font-black text-zinc-900 text-sm">
                                    ₹{order.totalAmount}
                                  </td>
                                  <td className="px-5 py-3.5">
                                    {isPaid ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                        <CheckCircle className="h-3 w-3" /> Paid
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                        <Clock className="h-3 w-3" /> Pending
                                      </span>
                                    )}
                                    <div className="text-[9px] text-zinc-400 font-mono mt-0.5">
                                      {order.paymentDetails?.razorpayPaymentId || 'Razorpay Direct'}
                                    </div>
                                  </td>
                                  <td className="px-5 py-3.5">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                                      <Check className="h-3 w-3" /> Cloudinary Emailed
                                    </span>
                                  </td>
                                  <td className="px-5 py-3.5">
                                    <button
                                      onClick={() => setSelectedOrder(order)}
                                      className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                                    >
                                      <Eye className="h-3.5 w-3.5" /> Details
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* MODERN PAGINATION FOOTER */}
                    {filteredOrders.length > 0 && (
                      <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
                        
                        {/* Summary & Page Size selector */}
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-zinc-700">
                            Showing <strong className="text-zinc-900">{(currentSalesPage - 1) * salesItemsPerPage + 1}</strong> to <strong className="text-zinc-900">{Math.min(currentSalesPage * salesItemsPerPage, filteredOrders.length)}</strong> of <strong className="text-zinc-900">{filteredOrders.length}</strong> orders
                          </span>

                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-zinc-400">Rows per page:</span>
                            <select
                              value={salesItemsPerPage}
                              onChange={(e) => {
                                setSalesItemsPerPage(Number(e.target.value));
                                setSalesCurrentPage(1);
                              }}
                              className="px-2 py-1 bg-white border border-zinc-300 rounded-lg font-bold text-zinc-800 focus:outline-none"
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                            </select>
                          </div>
                        </div>

                        {/* Page Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={currentSalesPage <= 1}
                            onClick={() => setSalesCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="p-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-white text-zinc-700 transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>

                          {Array.from({ length: totalSalesPages }, (_, i) => i + 1).map((pg) => (
                            <button
                              key={pg}
                              type="button"
                              onClick={() => setSalesCurrentPage(pg)}
                              className={`h-8 w-8 rounded-xl font-extrabold text-xs transition-colors cursor-pointer ${
                                currentSalesPage === pg
                                  ? 'bg-[#0d382c] text-white shadow-xs'
                                  : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                              }`}
                            >
                              {pg}
                            </button>
                          ))}

                          <button
                            type="button"
                            disabled={currentSalesPage >= totalSalesPages}
                            onClick={() => setSalesCurrentPage(prev => Math.min(prev + 1, totalSalesPages))}
                            className="p-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-white text-zinc-700 transition-colors cursor-pointer"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>

                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* SECTION 3: EDIT PRODUCTS CATALOG */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  {/* Search and Category bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-zinc-200 shadow-xs">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products by title, resolution, category, or format..."
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 text-xs font-bold bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900"
                      >
                        <option value="">All Categories</option>
                        <option value="ebooks-pdf">E-Books (PDF)</option>
                        <option value="digital-yantra">Digital Yantras</option>
                        <option value="sacred-symbols">Sacred Symbols</option>
                      </select>

                      <button
                        onClick={() => setActiveTab('upload')}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Direct Cloudinary Upload</span>
                      </button>
                    </div>
                  </div>

                  {/* Products Grid with Clear Edit Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => {
                      const isPdf = product.fileType === 'pdf' || (product.pdfUrl && product.pdfUrl.includes('.pdf'));
                      return (
                        <div key={product.id || product._id} className="bg-white rounded-3xl border border-zinc-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            {/* Product Thumbnail & Format Tag */}
                            <div className="relative aspect-video w-full rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden flex items-center justify-center">
                              <img
                                src={product.image || product.pngUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                              <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-xs ${
                                isPdf ? 'bg-amber-500 text-zinc-950' : 'bg-[#0d382c] text-white'
                              }`}>
                                {isPdf ? 'PDF E-BOOK' : 'PNG 4K'}
                              </span>

                              {/* Quick In-Stock Toggle Badge */}
                              <button
                                onClick={() => handleToggleStock(product)}
                                className={`absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer backdrop-blur-xs transition-all ${
                                  product.inStock !== false ? 'bg-emerald-600/90 text-white' : 'bg-red-600/90 text-white'
                                }`}
                              >
                                {product.inStock !== false ? 'In Stock' : 'Sold Out'}
                              </button>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                {product.categoryName || product.category || 'Digital Asset'}
                              </span>
                              <h4 className="text-sm font-extrabold text-zinc-900 mt-1 line-clamp-1">{product.name}</h4>
                              <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{product.description}</p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                            <div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-base font-black text-zinc-900">₹{product.price}</span>
                                {product.originalPrice > product.price && (
                                  <span className="text-xs text-zinc-400 line-through">₹{product.originalPrice}</span>
                                )}
                              </div>
                              <div className="text-[10px] text-zinc-400">Downloads: {product.downloadsCount || 0}</div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(product)}
                                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shadow-xs"
                              >
                                <Edit className="h-3.5 w-3.5 text-amber-400" /> Edit Product
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION 4: DIRECT CLOUDINARY UPLOAD TAB */}
              {activeTab === 'upload' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  
                  <div className="bg-[#0d382c] text-white p-6 rounded-3xl shadow-lg space-y-2 border border-zinc-800">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                      <CloudUpload className="h-4 w-4" />
                      <span>DIRECT CLOUDINARY FILE UPLOADER</span>
                    </div>
                    <h2 className="text-xl font-black tracking-tight">Direct Cloudinary Asset Uploader</h2>
                    <p className="text-xs text-emerald-100/80 leading-relaxed">
                      Select your image (.png, .jpg, .webp) or PDF manuscript (.pdf) below. It uploads directly to Cloudinary via backend API automatically! No separate URL input required.
                    </p>
                  </div>

                  {publishSuccess && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 animate-fade-in">
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold">{publishSuccess}</span>
                    </div>
                  )}

                  {uploadError && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3 animate-fade-in">
                      <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                      <span className="text-xs font-semibold">{uploadError}</span>
                    </div>
                  )}

                  <form onSubmit={handlePublishProduct} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-5">
                    
                    {/* Format Toggle Pill */}
                    <div className="flex items-center gap-3 p-1.5 bg-zinc-100 rounded-2xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => { setUploadFileType('png'); setUploadCategory('Digital Yantras'); }}
                        className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          uploadFileType === 'png' ? 'bg-[#0d382c] text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <ImageIcon className="h-4 w-4" /> PNG Lossless Image
                      </button>

                      <button
                        type="button"
                        onClick={() => { setUploadFileType('pdf'); setUploadCategory('E-Books (PDF)'); }}
                        className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          uploadFileType === 'pdf' ? 'bg-amber-500 text-zinc-950 font-extrabold shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <BookOpen className="h-4 w-4" /> PDF E-Book Manuscript
                      </button>
                    </div>

                    {/* DIRECT CLOUDINARY FILE INPUT BOX */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-900 mb-2">
                        Select {uploadFileType === 'pdf' ? 'PDF E-Book Document' : 'PNG Image File'} (Direct Cloudinary Upload)
                      </label>

                      <label className="border-2 border-dashed border-zinc-300 hover:border-amber-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-zinc-50/80 hover:bg-amber-50/20 group">
                        {uploadingFile ? (
                          <div className="space-y-2 py-4">
                            <RefreshCw className="h-8 w-8 text-amber-500 animate-spin mx-auto" />
                            <span className="text-xs font-bold text-amber-700">{uploadStatusMsg || 'Uploading directly to Cloudinary...'}</span>
                          </div>
                        ) : filePreview ? (
                          <div className="space-y-3 w-full flex flex-col items-center">
                            <img src={filePreview} alt="Uploaded preview" className="max-h-44 object-contain rounded-2xl border border-zinc-200 shadow-sm" />
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" /> Uploaded directly to Cloudinary!
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono bg-zinc-100 px-3 py-1 rounded-full max-w-md truncate">
                              {cloudinaryDirectUrl}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); setFilePreview(null); setCloudinaryDirectUrl(''); }}
                              className="text-xs text-red-600 hover:underline font-bold"
                            >
                              Change File
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="p-3 bg-white rounded-2xl text-amber-500 shadow-xs border border-zinc-200 group-hover:scale-110 transition-transform mb-3">
                              <CloudUpload className="h-8 w-8" />
                            </div>
                            <span className="text-sm font-extrabold text-zinc-900">
                              Click to select {uploadFileType === 'pdf' ? '.PDF E-Book file' : '.PNG Image'}
                            </span>
                            <span className="text-xs text-zinc-500 mt-1">
                              File uploads directly to Cloudinary upon selection
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept={uploadFileType === 'pdf' ? 'application/pdf' : 'image/png, image/jpeg, image/webp'}
                          onChange={handleDirectFileSelect}
                          className="hidden"
                          disabled={uploadingFile}
                        />
                      </label>
                    </div>

                    {/* Metadata fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-800 mb-1">Product Title</label>
                        <input
                          type="text"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          placeholder={uploadFileType === 'pdf' ? 'e.g. Siddhar Remedies E-Book' : 'e.g. 4K Gold Yantra PNG'}
                          required
                          className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-zinc-800 mb-1">Offer Price (₹)</label>
                          <input
                            type="number"
                            value={uploadPrice}
                            onChange={(e) => setUploadPrice(e.target.value)}
                            placeholder="299"
                            required
                            className="w-full px-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:bg-white focus:border-zinc-900 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-800 mb-1">MRP (₹)</label>
                          <input
                            type="number"
                            value={uploadOriginalPrice}
                            onChange={(e) => setUploadOriginalPrice(e.target.value)}
                            placeholder="599"
                            className="w-full px-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-zinc-900 font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-800 mb-1">Category</label>
                        <select
                          value={uploadCategory}
                          onChange={(e) => setUploadCategory(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:bg-white focus:border-zinc-900 font-medium"
                        >
                          <option value="E-Books (PDF)">E-Books (PDF)</option>
                          <option value="Digital Yantras">Digital Yantras</option>
                          <option value="Sacred Symbols">Sacred Symbols</option>
                          <option value="Custom Uploads">Custom Uploads</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-800 mb-1">
                          {uploadFileType === 'pdf' ? 'Page Count' : 'Resolution Specs'}
                        </label>
                        <input
                          type="text"
                          value={uploadFileType === 'pdf' ? uploadPages : uploadResolution}
                          onChange={(e) => uploadFileType === 'pdf' ? setUploadPages(e.target.value) : setUploadResolution(e.target.value)}
                          placeholder={uploadFileType === 'pdf' ? '148 Pages' : '3840 x 3840 px (300 DPI)'}
                          className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:bg-white focus:border-zinc-900 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-800 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        placeholder="Detailed description of the digital asset or PDF chapters..."
                        className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:bg-white focus:border-zinc-900 font-medium"
                      />
                    </div>

                    {/* Submit Publish Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={uploadingFile}
                        className="w-full py-3 bg-[#0d382c] hover:bg-[#08261e] text-white text-xs font-extrabold rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <span>Publish & Save Product to Store</span>
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* SECTION 5: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
                      <div className="p-2.5 bg-amber-50 text-amber-800 rounded-2xl">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-zinc-900">Admin Security & Password</h3>
                        <p className="text-xs text-zinc-500">Update admin account details and store credentials</p>
                      </div>
                    </div>

                    {settingsSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <span>{settingsSuccess}</span>
                      </div>
                    )}

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-zinc-700 mb-1">Admin Username</label>
                        <input
                          type="text"
                          value={adminUserSetting}
                          onChange={(e) => setAdminUserSetting(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-zinc-700 mb-1">New Admin Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 font-semibold"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setSettingsSuccess('Admin account preferences saved!');
                          setNewPassword('');
                        }}
                        className="w-full py-2.5 bg-zinc-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-zinc-800 cursor-pointer"
                      >
                        Save Security Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative border border-zinc-200 animate-fade-in">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl font-bold">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-zinc-900">Buy Transaction Details</h3>
                <p className="text-xs text-zinc-400 font-mono">ID: {selectedOrder._id || selectedOrder.id}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-zinc-700">
              <div className="bg-zinc-50 p-3.5 rounded-2xl space-y-1 border border-zinc-100">
                <div className="font-bold text-zinc-900 uppercase text-[10px] tracking-wider">Customer Contact</div>
                <div><strong>Name:</strong> {selectedOrder.customer?.name}</div>
                <div><strong>Email:</strong> {selectedOrder.customer?.email}</div>
                <div><strong>Phone:</strong> {selectedOrder.customer?.phone}</div>
                <div><strong>Address:</strong> {selectedOrder.customer?.address}, {selectedOrder.customer?.state}</div>
              </div>

              <div className="bg-zinc-50 p-3.5 rounded-2xl space-y-1 border border-zinc-100">
                <div className="font-bold text-zinc-900 uppercase text-[10px] tracking-wider">Items Purchased</div>
                {selectedOrder.orderItems?.map((item, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-zinc-100 last:border-0">
                    <span>{item.name} (x{item.qty || 1})</span>
                    <span className="font-bold text-zinc-900">₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-50 p-3.5 rounded-2xl space-y-1 border border-zinc-100">
                <div className="font-bold text-zinc-900 uppercase text-[10px] tracking-wider">Payment & Cloudinary Link</div>
                <div><strong>Total Paid:</strong> ₹{selectedOrder.totalAmount}</div>
                <div><strong>Payment Status:</strong> {selectedOrder.paymentDetails?.status}</div>
                <div><strong>Razorpay Payment ID:</strong> {selectedOrder.paymentDetails?.razorpayPaymentId || 'N/A'}</div>
                <div><strong>Cloudinary Status:</strong> Download Link Emailed</div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-zinc-900 text-white font-bold text-xs rounded-full cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL PRODUCT EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 relative border border-zinc-200 animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
              <div className="p-2.5 bg-amber-50 text-amber-800 rounded-2xl font-bold">
                <Edit className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-zinc-900">Full Edit Product Controls</h3>
                <p className="text-xs text-zinc-400">Modify title, pricing, stock, category, or Cloudinary link</p>
              </div>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:border-zinc-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Offer Price (₹)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={editForm.originalPrice}
                    onChange={(e) => setEditForm({ ...editForm, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Stock Status</label>
                  <select
                    value={editForm.inStock ? 'true' : 'false'}
                    onChange={(e) => setEditForm({ ...editForm, inStock: e.target.value === 'true' })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 font-bold"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Sold Out</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editForm.categoryName}
                    onChange={(e) => setEditForm({ ...editForm, categoryName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Resolution / Pages</label>
                  <input
                    type="text"
                    value={editForm.resolution}
                    onChange={(e) => setEditForm({ ...editForm, resolution: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 font-medium"
                  />
                </div>
              </div>

              {/* 4 IMAGES FILE UPLOADS */}
              <div className="space-y-2 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                <label className="block font-bold text-zinc-900 text-[11px] uppercase tracking-wider flex items-center justify-between">
                  <span>Product Gallery Image Files (4 Slots)</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Click slot to upload file</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { field: 'img1', label: 'Primary Image 1' },
                    { field: 'img2', label: 'Gallery Image 2' },
                    { field: 'img3', label: 'Gallery Image 3' },
                    { field: 'img4', label: 'Gallery Image 4' }
                  ].map(({ field, label }, idx) => {
                    const imgVal = editForm[field];
                    return (
                      <div key={idx} className="bg-white rounded-xl p-2 border border-zinc-200 text-center space-y-1 shadow-xs">
                        <span className="text-[9px] font-bold text-zinc-700 block truncate">{label}</span>
                        {imgVal ? (
                          <div className="relative aspect-square w-full rounded-lg bg-zinc-50 border border-zinc-200 overflow-hidden flex items-center justify-center p-0.5">
                            <img src={imgVal} alt={`Slot ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                            <button
                              type="button"
                              onClick={() => setEditForm(prev => ({ ...prev, [field]: '' }))}
                              className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full"
                              title="Remove File"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="aspect-square rounded-lg border-2 border-dashed border-zinc-300 hover:border-emerald-500 bg-zinc-50 flex flex-col items-center justify-center p-1 cursor-pointer">
                            <Upload className="h-4 w-4 text-zinc-400 mb-1" />
                            <span className="text-[9px] font-bold text-zinc-700">Upload File</span>
                            <input
                              type="file"
                              accept="image/*, application/pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  setEditForm(prev => ({ ...prev, [field]: ev.target.result }));
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BUNDLE SELECTION */}
              <div className="space-y-1.5 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200">
                <label className="block font-bold text-emerald-950 text-[11px] uppercase tracking-wider">
                  Configure Bundle Products (Select up to 3)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    value={editForm.b1 || ''}
                    onChange={(e) => setEditForm({ ...editForm, b1: e.target.value })}
                    className="px-2 py-1 bg-white border border-emerald-300 rounded-lg text-[11px]"
                  >
                    <option value="">-- Bundle Product 1 --</option>
                    {products.map(p => (
                      <option key={p.id || p._id} value={p.id || p._id}>{p.name} (₹{p.price})</option>
                    ))}
                  </select>

                  <select
                    value={editForm.b2 || ''}
                    onChange={(e) => setEditForm({ ...editForm, b2: e.target.value })}
                    className="px-2 py-1 bg-white border border-emerald-300 rounded-lg text-[11px]"
                  >
                    <option value="">-- Bundle Product 2 --</option>
                    {products.map(p => (
                      <option key={p.id || p._id} value={p.id || p._id}>{p.name} (₹{p.price})</option>
                    ))}
                  </select>

                  <select
                    value={editForm.b3 || ''}
                    onChange={(e) => setEditForm({ ...editForm, b3: e.target.value })}
                    className="px-2 py-1 bg-white border border-emerald-300 rounded-lg text-[11px]"
                  >
                    <option value="">-- Bundle Product 3 --</option>
                    {products.map(p => (
                      <option key={p.id || p._id} value={p.id || p._id}>{p.name} (₹{p.price})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Cloudinary Download URL</label>
                <input
                  type="text"
                  value={editForm.cloudinaryUrl}
                  onChange={(e) => setEditForm({ ...editForm, cloudinaryUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-zinc-600 hover:text-zinc-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs rounded-full shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-4 w-4 text-amber-400" />
                  <span>Save All Edits</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative border border-zinc-200 animate-fade-in text-center">
            <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            
            <h3 className="text-lg font-extrabold text-zinc-900">Delete Product?</h3>
            <p className="text-xs text-zinc-500">
              Are you sure you want to delete <strong className="text-zinc-900">"{deletingProduct.name}"</strong>? This will permanently remove it from the store catalog.
            </p>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-5 py-2.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-zinc-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                disabled={isDeleting}
                className="px-6 py-2.5 text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                {isDeleting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span>Yes, Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
