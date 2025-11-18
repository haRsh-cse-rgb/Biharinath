export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  unit?: string;
  sku: string;
  categoryId: string | Category;
  images: string[];
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
  isFeatured: boolean;
  isActive: boolean;
  stock: number;
  lowStockThreshold: number;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  totalAmount: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  couponCode?: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  orderStatus: OrderStatus;
  statusHistory: OrderStatusUpdate[];
  notes?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
  subtotal: number;
}

export interface OrderStatusUpdate {
  status: OrderStatus;
  timestamp: Date;
  notes?: string;
  updatedBy?: string;
}

export interface Address {
  _id?: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'shipping' | 'billing';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SiteBooking {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  numberOfPeople: number;
  purpose?: string;
  notes?: string;
  status: BookingStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  _id: string;
  userId: string;
  productId: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: 'customer' | 'admin';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface OrderItemWithProduct extends OrderItem {
  product?: Product;
}

export interface OrderWithItems extends Order {
  items: OrderItemWithProduct[];
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export type ProductInsert = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>;
export type ProductUpdate = Partial<ProductInsert>;
export type CategoryInsert = Omit<Category, '_id' | 'createdAt' | 'updatedAt'>;
export type AddressInsert = Omit<Address, '_id' | 'createdAt' | 'updatedAt'>;
export type SiteBookingInsert = Omit<SiteBooking, '_id' | 'createdAt' | 'updatedAt'>;
