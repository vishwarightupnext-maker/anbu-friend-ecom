import React, { useState, useEffect } from 'react';
import { X, CreditCard, ShieldCheck, Lock, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { createPaymentOrder, verifyPayment, getPaymentConfig } from '../api';

export default function CheckoutModal({ product, isOpen, onClose, onPaymentSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSimulated, setIsSimulated] = useState(true);
  const [razorpayKeyId, setRazorpayKeyId] = useState('');

  useEffect(() => {
    if (isOpen) {
      getPaymentConfig().then((cfg) => {
        setIsSimulated(cfg.isSimulated);
        setRazorpayKeyId(cfg.keyId);
      });
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError('Please provide your name, phone number, and email to deliver the PNG download link');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const customerDetails = {
        name,
        email,
        phone,
        address: 'Digital Asset Online Delivery',
        city: 'Digital Store',
        state: 'Tamil Nadu',
        postalCode: '625001'
      };

      const orderItems = [
        {
          id: product.id || product._id,
          name: product.name,
          qty: 1,
          price: product.price
        }
      ];

      // 1. Create order on backend
      const resData = await createPaymentOrder({
        amount: product.price,
        customerDetails,
        orderItems
      });

      if (!resData || !resData.success) {
        throw new Error(resData?.message || 'Failed to initiate checkout order');
      }

      const { orderId, dbOrderId, isSimulated: orderSimulated } = resData;

      // 2. Handle Razorpay Live vs Instant Simulated Mode
      if (orderSimulated || !window.Razorpay || !razorpayKeyId) {
        // Instant simulated mode for immediate testing & demonstration
        console.log('Completing simulated payment for instant test PNG download authorization...');
        
        const verifyRes = await verifyPayment({
          dbOrderId,
          razorpayOrderId: orderId,
          razorpayPaymentId: `pay_sim_${Date.now()}`,
          razorpaySignature: `sig_sim_${Date.now()}`,
          isSimulated: true
        });

        if (verifyRes && verifyRes.success) {
          onPaymentSuccess(verifyRes.order, product);
          onClose();
        } else {
          throw new Error('Payment simulation verification failed');
        }

      } else {
        // Real Razorpay popup invocation
        const options = {
          key: razorpayKeyId,
          amount: resData.amount,
          currency: resData.currency || 'INR',
          name: 'AURA Digital PNG Store',
          description: `Download PNG: ${product.name}`,
          order_id: orderId,
          prefill: {
            name,
            email,
            contact: phone
          },
          theme: {
            color: '#18181b'
          },
          handler: async function (response) {
            try {
              const verifyRes = await verifyPayment({
                dbOrderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                isSimulated: false
              });

              if (verifyRes && verifyRes.success) {
                onPaymentSuccess(verifyRes.order, product);
                onClose();
              } else {
                setError('Payment verification failed.');
              }
            } catch (err) {
              setError('Payment verification error: ' + err.message);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }

    } catch (err) {
      setError(err.message || 'Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">Secure Digital Payment</h2>
              <p className="text-xs text-zinc-500">Unlock instant PNG download link</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Product Summary Box */}
        <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 flex items-center gap-4">
          <img 
            src={product.pngUrl || product.image} 
            alt={product.name} 
            className="h-16 w-16 object-contain rounded-xl bg-white border border-zinc-200 p-1"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">PNG ASSET</span>
            <h4 className="text-xs font-semibold text-zinc-900 truncate">{product.name}</h4>
            <p className="text-[11px] text-zinc-500">4K Lossless PNG • Instant Access</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-zinc-900">₹{product.price}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                required
                className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>256-Bit Encrypted Razorpay Checkout. Instant PNG file access immediately after payment.</span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold text-xs rounded-full shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Processing Payment & Unlocking PNG...</span>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>Pay ₹{product.price} & Download PNG File</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
