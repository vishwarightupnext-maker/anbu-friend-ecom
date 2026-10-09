import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Mail, Sparkles, BookOpen } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQty, 
  onRemoveItem, 
  onClearCart, 
  onProceedToCheckout 
}) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.qty || 1), 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/70 backdrop-blur-md flex justify-end animate-fade-in font-sans">
      
      {/* Backdrop overlay */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-zinc-200 z-10 animate-slide-in">
        
        {/* Header */}
        <div className="bg-[#0d382c] text-white p-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black shadow-sm">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">Your Shopping Cart</h2>
                <span className="text-[10px] bg-amber-400 text-zinc-950 font-black px-2 py-0.5 rounded-full">
                  {totalItemsCount} ITEMS
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">Cloudinary Email Delivery upon Checkout</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Email Only Notice Bar */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 text-xs text-amber-900 font-semibold flex items-center gap-2">
          <Mail className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Cloudinary download links are dispatched directly to your <strong>Email</strong> upon payment.</span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="h-16 w-16 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto text-zinc-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-bold text-zinc-800">Your Cart is Empty</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Explore our E-Books (PDF) and 4K PNG assets catalog and click "Add to Cart" to build your order!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => {
                const isPdf = item.fileType === 'pdf' || (item.pdfUrl && item.pdfUrl.includes('.pdf'));
                const itemId = item.id || item._id;
                return (
                  <div key={itemId} className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200/80 flex items-center gap-3 hover:bg-zinc-100/60 transition-colors">
                    
                    {/* Item Image */}
                    <div className="h-16 w-16 rounded-xl bg-white border border-zinc-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image || item.pngUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Item Information */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        isPdf ? 'bg-amber-100 text-amber-900' : 'bg-zinc-900 text-white'
                      }`}>
                        {isPdf ? 'PDF E-BOOK' : 'PNG ASSET'}
                      </span>
                      <h4 className="text-xs font-bold text-zinc-900 truncate mt-1">{item.name}</h4>
                      <div className="text-xs font-black text-emerald-700 mt-0.5">₹{item.price}</div>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => onRemoveItem(itemId)}
                        className="text-zinc-400 hover:text-red-600 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQty(itemId, (item.qty || 1) - 1)}
                          className="h-5 w-5 bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-zinc-900">{item.qty || 1}</span>
                        <button
                          onClick={() => onUpdateQty(itemId, (item.qty || 1) + 1)}
                          className="h-5 w-5 bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}

              <div className="pt-2 text-right">
                <button
                  onClick={onClearCart}
                  className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-zinc-50 border-t border-zinc-200 space-y-4">
            
            <div className="space-y-2 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="font-bold text-zinc-900">₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Cloudinary Email Delivery</span>
                <span>FREE</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-black text-zinc-900">
                <span>Total Amount</span>
                <span className="text-base text-emerald-700">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-6 bg-[#0d382c] hover:bg-[#07241c] text-white text-xs font-extrabold rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>PROCEED TO CHECKOUT (₹{totalAmount.toLocaleString()})</span>
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Encrypted Razorpay Payment • Instant Email Delivery</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
