import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import CheckoutModal from './components/CheckoutModal';
import PaymentSuccessModal from './components/PaymentSuccessModal';
import MyDownloadsModal from './components/MyDownloadsModal';
import PolicyModal from './components/PolicyModal';
import Footer from './components/Footer';
import { fetchProducts } from './api';
import { Sparkles, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  // Modals & Views
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [myDownloadsOpen, setMyDownloadsOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState('shipping');
  
  // Cart State Storage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('clyrova_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Success state
  const [successOrder, setSuccessOrder] = useState(null);
  const [successProduct, setSuccessProduct] = useState(null);

  // Purchased products storage
  const [purchasedProducts, setPurchasedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_purchased_pngs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Fetch products from backend API
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(activeCategory);
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Could not connect to backend server. Operating with fallback assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [activeCategory]);

  // Cart Management Functions
  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const pId = product.id || product._id;
      const existingIndex = prev.findIndex(item => (item.id || item._id) === pId);
      let updated;
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex].qty = (updated[existingIndex].qty || 1) + qty;
      } else {
        updated = [...prev, { ...product, qty }];
      }
      localStorage.setItem('clyrova_cart_items', JSON.stringify(updated));
      return updated;
    });
    setCartDrawerOpen(true);
  };

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => {
      const updated = prev.map(item => (item.id || item._id) === productId ? { ...item, qty } : item);
      localStorage.setItem('clyrova_cart_items', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const updated = prev.filter(item => (item.id || item._id) !== productId);
      localStorage.setItem('clyrova_cart_items', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('clyrova_cart_items');
  };

  // Save purchased PNGs to local storage
  const savePurchasedProduct = (product) => {
    setPurchasedProducts((prev) => {
      const exists = prev.some((p) => (p.id || p._id) === (product.id || product._id));
      if (exists) return prev;
      const updated = [product, ...prev];
      localStorage.setItem('aura_purchased_pngs', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle successful payment completion
  const handlePaymentSuccess = (order, product) => {
    savePurchasedProduct(product);
    setSuccessOrder(order);
    setSuccessProduct(product);

    // If checkout was from cart, clear cart
    if (cartItems.length > 0) {
      cartItems.forEach(item => savePurchasedProduct(item));
      clearCart();
    }
  };

  // Open Policy Modal with selected tab
  const handleOpenPolicy = (tab = 'shipping') => {
    setPolicyTab(tab);
    setPolicyModalOpen(true);
  };

  // Prepare checkout payload from cart
  const handleCheckoutFromCart = () => {
    if (cartItems.length === 0) return;

    const totalAmount = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.qty || 1), 0);
    const combinedTitle = cartItems.length === 1 ? cartItems[0].name : `${cartItems[0].name} & ${cartItems.length - 1} other item(s)`;

    const combinedProduct = {
      _id: cartItems[0].id || cartItems[0]._id,
      id: cartItems[0].id || cartItems[0]._id,
      name: combinedTitle,
      price: totalAmount,
      image: cartItems[0].image,
      cloudinaryUrl: cartItems[0].cloudinaryUrl,
      pdfUrl: cartItems[0].pdfUrl,
      pngUrl: cartItems[0].pngUrl,
      fileType: cartItems[0].fileType
    };

    setCheckoutProduct(combinedProduct);
  };

  // Filter products by search query
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.categoryName?.toLowerCase().includes(q) ||
      p.unit?.toLowerCase().includes(q)
    );
  });

  const cartCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-[#0d382c] selection:text-white">
      
      {/* Top Header & Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onOpenAdmin={() => setAdminDashboardOpen(true)}
        onOpenMyDownloads={() => setMyDownloadsOpen(true)}
        onOpenCart={() => setCartDrawerOpen(true)}
        purchasedCount={purchasedProducts.length}
        cartCount={cartCount}
      />

      {/* Main Hero Section */}
      <HeroBanner />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Gallery Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
              {activeCategory ? activeCategory.replace('-', ' ').toUpperCase() : 'ALL DIGITAL ASSETS & E-BOOKS'}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Showing {filteredProducts.length} high-resolution PNG & PDF E-Book assets • Cloudinary Email Delivery
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadProducts}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Store</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-zinc-50 rounded-3xl p-4 border border-zinc-200/80 animate-pulse space-y-4">
                <div className="aspect-square bg-zinc-200 rounded-2xl" />
                <div className="h-4 bg-zinc-200 rounded w-3/4" />
                <div className="h-3 bg-zinc-200 rounded w-1/2" />
                <div className="h-8 bg-zinc-200 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-zinc-50/50 rounded-3xl border border-zinc-200/80 p-12 text-center space-y-4 my-8">
            <div className="h-16 w-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center mx-auto shadow-xs text-zinc-400">
              <ImageIcon className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-800">No products match your query</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try adjusting your search terms or category filter to explore all available digital assets!
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory(''); }}
              className="px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-full shadow-xs hover:bg-zinc-800 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isPurchased = purchasedProducts.some(
                (p) => (p.id || p._id) === (product.id || product._id)
              );
              return (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  isPurchased={isPurchased}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onBuyNow={(p) => setCheckoutProduct(p)}
                  onAddToCart={(p) => addToCart(p, 1)}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer onOpenPolicy={handleOpenPolicy} />

      {/* MODALS & DRAWERS */}

      {/* Official Clyrova Store Policy Modal */}
      <PolicyModal
        isOpen={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        initialTab={policyTab}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onProceedToCheckout={handleCheckoutFromCart}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isPurchased={
          selectedProduct &&
          purchasedProducts.some(
            (p) => (p.id || p._id) === (selectedProduct.id || selectedProduct._id)
          )
        }
        onClose={() => setSelectedProduct(null)}
        onBuyNow={(p) => setCheckoutProduct(p)}
        onAddToCart={(p) => addToCart(p, 1)}
      />

      {/* SEPARATE SIDEBAR ADMIN DASHBOARD */}
      {adminDashboardOpen && (
        <AdminDashboard
          onClose={() => setAdminDashboardOpen(false)}
          onProductsUpdated={loadProducts}
        />
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        product={checkoutProduct}
        isOpen={!!checkoutProduct}
        onClose={() => setCheckoutProduct(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Instant Payment Success & PNG File Download Modal */}
      <PaymentSuccessModal
        isOpen={!!successProduct}
        product={successProduct}
        order={successOrder}
        onClose={() => {
          setSuccessProduct(null);
          setSuccessOrder(null);
        }}
      />

      {/* My Purchased Downloads History Modal */}
      <MyDownloadsModal
        isOpen={myDownloadsOpen}
        onClose={() => setMyDownloadsOpen(false)}
        purchasedProducts={purchasedProducts}
      />

    </div>
  );
}
