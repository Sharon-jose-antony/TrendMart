const mongoose = require('mongoose');

const baseOptions = {
  strict: false,
  versionKey: false,
  toJSON: {
    transform(_doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform(_doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
};

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  slug: { type: String, default: '' },
  icon: { type: String, default: '📦' },
  description: { type: String, default: '' }
}, baseOptions);

const sellerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  storeName: { type: String, required: true },
  ownerName: { type: String, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: 'password123' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  rating: { type: Number, default: 5.0 },
  totalSales: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
  joinedAt: { type: String, default: () => new Date().toISOString() }
}, baseOptions);

const customerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: 'password123' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  ordersCount: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  registeredAt: { type: String, default: () => new Date().toISOString() }
}, baseOptions);

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, default: 0 },
  originalPrice: { type: Number, default: 0 },
  category: { type: String, default: 'Electronics' },
  categoryId: { type: String, default: 'cat-1' },
  sellerId: { type: String, default: 'seller-1' },
  sellerName: { type: String, default: 'Direct Seller' },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  status: { type: String, default: 'In Stock' },
  image: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, baseOptions);

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  sellerId: { type: String, default: '' },
  title: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  price: { type: Number, default: 0 }
}, { _id: false, strict: false });

const trackingEntrySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() },
  note: { type: String, default: '' }
}, { _id: false, strict: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  orderNumber: { type: String, required: true, index: true },
  customerId: { type: String, default: '' },
  customerName: { type: String, default: 'Customer' },
  customerEmail: { type: String, default: '' },
  customerPhone: { type: String, default: '' },
  shippingAddress: { type: String, default: '' },
  items: { type: [orderItemSchema], default: [] },
  totalAmount: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'Online Payment' },
  paymentStatus: { type: String, default: 'Paid' },
  status: { type: String, default: 'Processing' },
  orderDate: { type: String, default: () => new Date().toISOString() },
  trackingHistory: { type: [trackingEntrySchema], default: [] }
}, baseOptions);

const bannerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  linkText: { type: String, default: 'Shop the Sale' },
  category: { type: String, default: 'Electronics' },
  active: { type: Boolean, default: false },
  image: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, baseOptions);

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Seller = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

module.exports = {
  Category,
  Seller,
  Customer,
  Product,
  Order,
  Banner
};
