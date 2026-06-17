// ─── Auth ────────────────────────────────────────────────────────────────────

export type UserRole = "user" | "admin" | "SUPER_ADMIN" | "MANAGER" | "ANALYST";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age?: number;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface Order {
  id: string;
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  notes?: string;
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export type PaymentMethod =
  | "CASH_ON_DELIVERY"
  | "PAYPAL"
  | "STRIPE"
  | "CINETPAY";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  orderId: string;
  userId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  notes?: string;
  createdAt?: string;
}

// ─── Shipment ─────────────────────────────────────────────────────────────────

export type ShipmentStatus =
  | "PENDING"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  location: string;
  createdAt: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  weight: number;
  status: ShipmentStatus;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  trackingEvents: TrackingEvent[];
  label?: string | null;
}

// ─── Warehouse ────────────────────────────────────────────────────────────────

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export interface InventoryItem {
  id: string;
  productId: number;
  warehouseId: string;
  quantity: number;
  product?: Product;
  warehouse?: Warehouse;
}

// ─── Address ──────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  userId: number;
  street: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  user?: Pick<User, "id" | "username" | "firstName" | "lastName">;
}