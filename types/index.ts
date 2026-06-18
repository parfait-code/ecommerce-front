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
  product?: Pick<Product, "id" | "name" | "images">;
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
  user?: Pick<User, "id" | "username" | "email" | "firstName" | "lastName">;
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

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

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
  updatedAt?: string;
  order?: Order;
  user?: Pick<User, "id" | "username" | "email" | "firstName" | "lastName">;
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
  dimensions?: { length: number; width: number; height: number };
  status: ShipmentStatus;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  trackingEvents: TrackingEvent[];
  label?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Warehouse ────────────────────────────────────────────────────────────────

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  totalUnits?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export interface InventoryItem {
  id: string;
  productId: number;
  warehouseId: string;
  quantity: number;
  product?: Pick<Product, "id" | "name" | "category" | "price"> & {
    images?: string[];
  };
  warehouse?: Warehouse;
  createdAt?: string;
  updatedAt?: string;
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

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  products: {
    total: number;
    addedThisMonth: number;
  };
  orders: {
    total: number;
    thisMonth: number;
    trend: number;
  };
  users: {
    total: number;
    active: number;
  };
  payments: {
    totalAmountThisMonth: number;
    currency: string;
    trend: number;
  };
  inventory: {
    lowStockCount: number;
  };
  shipments: {
    inProgress: number;
    trend: number;
  };
}

export interface SalesChartPoint {
  label: string;
  amount: number;
  orderCount: number;
}

export interface SalesChartData {
  period: string;
  year: number;
  currency: string;
  points: SalesChartPoint[];
}