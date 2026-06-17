import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  CreditCard,
  Truck,
  Users,
  Warehouse,
  MapPin,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Produits",
    href: "/products",
    icon: Package,
  },
  {
    label: "Inventaire",
    href: "/inventory",
    icon: Boxes,
  },
  {
    label: "Commandes",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    label: "Paiements",
    href: "/payments",
    icon: CreditCard,
  },
  {
    label: "Expéditions",
    href: "/shipments",
    icon: Truck,
  },
  {
    label: "Utilisateurs",
    href: "/users",
    icon: Users,
  },
  {
    label: "Entrepôts",
    href: "/warehouses",
    icon: Warehouse,
  },
  {
    label: "Adresses",
    href: "/addresses",
    icon: MapPin,
  },
  {
    label: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PROCESSING: "En traitement",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "warning",
  CONFIRMED: "info",
  PROCESSING: "info",
  SHIPPED: "accent",
  DELIVERED: "success",
  CANCELLED: "danger",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  COMPLETED: "Complété",
  FAILED: "Échoué",
  REFUNDED: "Remboursé",
};

export const SHIPMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  IN_TRANSIT: "En transit",
  DELIVERED: "Livré",
  CANCELLED: "Annulé",
};

export const ROLE_LABELS: Record<string, string> = {
  user: "Utilisateur",
  admin: "Administrateur",
  SUPER_ADMIN: "Super Admin",
  MANAGER: "Manager",
  ANALYST: "Analyste",
};