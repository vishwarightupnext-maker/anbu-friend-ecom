import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String },
    state: { type: String, required: true },
    postalCode: { type: String }
  },
  orderItems: [
    {
      product: {
        type: String,
        required: true
      },
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  paymentDetails: {
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    isSimulated: { type: Boolean, default: false }
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0.0
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
