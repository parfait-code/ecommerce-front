# Guide d'intégration API — E-Commerce API

> **Base URL** (dev) : `http://localhost:3000`
> **Content-Type** : `application/json` (sauf routes upload → `multipart/form-data`)
> **Auth** : header `Authorization: Bearer <token>` (JWT, obtenu via `/login` ou `/signup`)
> **Devise** : toutes les valeurs monétaires sont en `XAF`

---

## 1. Conventions générales

### Réponse succès
```json
{ "status": true, "data": { /* ... */ } }
```

### Réponse erreur
```json
{ "status": false, "error": { "message": "Description de l'erreur" } }
```

### Réponse erreur de validation (400, via Zod)
```json
{
  "status": false,
  "error": {
    "message": "Validation failed",
    "details": {
      "formErrors": [],
      "fieldErrors": { "email": ["Invalid email"] }
    }
  }
}
```

### Pagination — paramètres query communs
| Paramètre | Type   | Défaut | Description              |
|-----------|--------|--------|---------------------------|
| `page`    | number | 1      | Numéro de page            |
| `limit`   | number | 20     | Éléments par page          |

### Réponse paginée (shape générique)
```ts
interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```
⚠️ `GET /inventory` retourne un objet paginé (pas un tableau plat) — à garder en tête côté front.

### Rôles utilisateur
`USER` (client standard) · `ADMIN` · `MANAGER` · `SUPPORT`
Les routes marquées 🔒 **ADMIN** nécessitent `role === "ADMIN"`.

### Codes HTTP
| Code | Signification |
|------|----------------|
| 200 | OK |
| 201 | Créé |
| 400 | Payload invalide / validation échouée |
| 401 | Token manquant, invalide ou expiré |
| 403 | Rôle insuffisant / accès à une ressource d'un autre utilisateur |
| 404 | Ressource introuvable |
| 409 | Conflit (doublon : slug, sku, username, email...) |
| 429 | Rate limit dépassé (100 req / 15 min) |
| 500 | Erreur interne |
| 503 | Fonctionnalité temporairement indisponible (ex : moyens de paiement non branchés) |

### Recommandation client TS
```ts
interface ApiSuccess<T> { status: true; data: T }
interface ApiError { status: false; error: { message: string; details?: unknown } }
type ApiResponse<T> = ApiSuccess<T> | ApiError;
```

---

## 2. Auth

### `POST /signup` — Auth: ❌
**Body**
```ts
{
  username: string;      // 3-50
  email: string;
  password: string;      // min 6
  firstName: string;     // 2-50
  lastName: string;      // 2-50
  dateOfBirth?: string;  // ISO datetime
  phone?: string;
  role?: "USER" | "ADMIN" | "MANAGER" | "SUPPORT"; // défaut USER
}
```
**Réponse 200**
```ts
{
  user: { id: number; username: string; email: string; firstName: string; lastName: string;
          dateOfBirth: string | null; phone: string | null; role: string; isActive: boolean;
          createdAt: string; updatedAt: string }; // sans password
  token: string; // JWT
}
```

### `POST /login` — Auth: ❌
**Body** `{ username: string; password: string }`
**Réponse 200** — identique à `/signup` (`{ user, token }`)

---

## 3. Utilisateurs (`/user`)

### `GET /user` — Auth: ✅
Retourne le profil de l'utilisateur connecté (sans `password`).

### `PATCH /user` — Auth: ✅
**Body** (tous optionnels)
```ts
{ email?: string; firstName?: string; lastName?: string; dateOfBirth?: string; phone?: string }
```

### `GET /user/all` 🔒 ADMIN
Retourne `User[]` (sans `password`).

### `GET /user/:userId` 🔒 ADMIN
Retourne le profil de l'utilisateur ciblé.

### `POST /user` 🔒 ADMIN
**Body**
```ts
{ username: string; email: string; password: string; firstName: string; lastName: string;
  dateOfBirth?: string; phone?: string; role?: "USER"|"ADMIN"|"MANAGER"|"SUPPORT" }
```
**201** → utilisateur créé (sans `password`)

### `PATCH /user/change-role/:userId` 🔒 ADMIN
**Body** `{ role: "USER"|"ADMIN"|"MANAGER"|"SUPPORT" }`

### `DELETE /user/:userId` 🔒 ADMIN
**200** `{ numberOfUsersDeleted: 1 }` (soft delete)

---

## 4. Produits (`/product`)

### `GET /product` — Auth: ❌
**Query** `page?, limit?, categoryId?`
**Réponse** `Paginated<Product>` où :
```ts
interface Product {
  id: number; sku: string; name: string; description: string | null;
  price: number; status: "DRAFT"|"ACTIVE"|"ARCHIVED"; weight: number | null;
  brand: string | null; categoryId: string;
  category: { id: string; name: string; slug: string };
  images: { id: string; url: string; altText: string|null; position: number; isPrimary: boolean }[];
  variants: Variant[];
  attributeValues: { id: string; value: string; attributeDefinition: {...} }[];
  createdAt: string; updatedAt: string;
}
```

### `GET /product/:productId` — Auth: ❌
Retourne un `Product` complet (404 si introuvable ou soft-deleted).

### `POST /product` 🔒 ADMIN
**Body**
```ts
{ sku: string; name: string; description?: string; price: number; categoryId: string;
  status?: "DRAFT"|"ACTIVE"|"ARCHIVED"; weight?: number }
```
**201** → `Product`

### `PATCH /product/:productId` 🔒 ADMIN
Body identique en partiel.

### `DELETE /product/:productId` 🔒 ADMIN
**200** `{ numberOfProductsDeleted: 1 }` (soft delete)

### `POST /product/:productId/images` 🔒 ADMIN — `multipart/form-data`
| Champ | Type | Notes |
|---|---|---|
| `images` | File[] | 1 à 5, jpeg/png/webp/gif, 5MB max chacun |
| `variantId` | string | optionnel |
**200** → `Product` mis à jour

### `DELETE /product/:productId/images` 🔒 ADMIN
**Body** `{ imageId: string }` → `Product` mis à jour

---

## 5. Variants produit (`/product/:productId/variants`)

### `GET /` — Auth: ✅ → `Variant[]`
### `GET /:variantId` — Auth: ✅ → `Variant`
```ts
interface Variant {
  id: string; productId: number; sku: string; price: number | null; isActive: boolean;
  attributeValues: { id: string; value: string; attributeDefinition: {...} }[];
  inventory: { id: string; quantity: number; warehouseId: string }[];
  images: ProductImage[]; createdAt: string; updatedAt: string;
}
```

### `POST /` 🔒 ADMIN
**Body**
```ts
{ sku: string; price?: number; isActive?: boolean; // défaut true
  attributes: { attributeDefinitionId: string; value: string }[] } // min 1
```
**201** → `Variant`

### `PATCH /:variantId` 🔒 ADMIN — même body en partiel
### `DELETE /:variantId` 🔒 ADMIN → `{ message: "Variant deleted successfully" }`

---

## 6. Catégories (`/categories`)

### `GET /categories` — Auth: ✅ → `Category[]`
```ts
interface Category {
  id: string; name: string; slug: string; description: string|null;
  imageUrl: string|null; iconUrl: string|null; metaTitle: string|null; metaDescription: string|null;
  isActive: boolean; parentId: string|null;
  parent: { id: string; name: string; slug: string } | null;
  children: { id: string; name: string; slug: string }[];
  _count: { products: number };
}
```

### `GET /categories/:categoryId` — Auth: ✅ → `Category`
### `GET /categories/slug/:slug` — Auth: ❌ → `Category`
### `GET /categories/slug/:slug/products` — Auth: ❌
**Query** `page?, limit?`
```ts
{ category: { id, name, slug }; items: Product[]; total; page; limit; totalPages }
```

### `POST /categories` 🔒 ADMIN
**Body**
```ts
{ name: string; slug: string; // lowercase-hyphenated
  description?: string; imageUrl?: string; iconUrl?: string;
  metaTitle?: string; metaDescription?: string; isActive?: boolean; parentId?: string }
```
**201** → `Category`

### `PUT /categories/:categoryId` 🔒 ADMIN — body partiel
### `DELETE /categories/:categoryId` 🔒 ADMIN
**200** `{ message: "Category deleted successfully" }`
⚠️ **400** si des produits sont encore rattachés.

---

## 7. Attributs (`/categories/:categoryId/attributes`, `/attributes`)

### `GET /categories/:categoryId/attributes` — Auth: ✅ → `AttributeDefinition[]`
```ts
interface AttributeDefinition {
  id: string; categoryId: string; name: string; slug: string;
  type: "TEXT"|"NUMBER"|"COLOR"|"BOOLEAN"|"SELECT"; unit: string|null;
  isVariant: boolean; isFilterable: boolean; isRequired: boolean; position: number;
  options: { id: string; value: string; colorHex: string|null; position: number }[];
  category: { id, name, slug };
}
```

### `POST /categories/:categoryId/attributes` 🔒 ADMIN
**Body**
```ts
{ name: string; slug: string; type: "TEXT"|"NUMBER"|"COLOR"|"BOOLEAN"|"SELECT";
  unit?: string; isVariant?: boolean; isFilterable?: boolean; isRequired?: boolean; position?: number }
```
**201** → `AttributeDefinition`

### `GET /attributes/:definitionId` — Auth: ✅ → `AttributeDefinition`
### `PATCH /attributes/:definitionId` 🔒 ADMIN — body partiel
### `DELETE /attributes/:definitionId` 🔒 ADMIN → `{ message: "Attribute definition deleted successfully" }`

### `POST /attributes/:definitionId/options` 🔒 ADMIN
**Body** `{ value: string; colorHex?: string /* #RRGGBB */; position?: number }`
**201** → option créée

### `DELETE /attributes/options/:optionId` 🔒 ADMIN → `{ message: "Option deleted successfully" }`

### `PUT /product/:productId/attributes` 🔒 ADMIN
**Body** `{ attributes: { attributeDefinitionId: string; value: string }[] }`
Remplace toutes les valeurs d'attributs du produit → `ProductAttributeValue[]`

---

## 8. Tags (`/tags`, `/product/:productId/tags`)

### `GET /tags` — Auth: ❌ → `Tag[]`
### `GET /tags/:tagId` — Auth: ❌ → `Tag` (avec `products`)
### `POST /tags` 🔒 ADMIN — Body `{ name: string; slug: string }` → 201
### `PATCH /tags/:tagId` 🔒 ADMIN — body partiel
### `DELETE /tags/:tagId` 🔒 ADMIN → `{ message: "Tag deleted successfully" }`
### `PUT /product/:productId/tags` 🔒 ADMIN — Body `{ tagIds: string[] }` (min 1) → produit avec tags
### `GET /product/:productId/tags` — Auth: ✅ → `ProductTag[]` (avec `tag`)

---

## 9. Panier (`/basket`)

### `POST /basket` — Auth: ✅
**201** `{ id, userId, items: [], createdAt, updatedAt }`

### `GET /basket/:basket_id` — Auth: ✅
```ts
interface Basket {
  id: string; userId: number;
  items: { id: string; productId: number; variantId: string|null; quantity: number;
           product: Product; variant: Variant|null }[];
}
```

### `POST /basket/:basket_id/product` — Auth: ✅
**Body** `{ product_id: number; variant_id?: string; quantity: number }` → `Basket` mis à jour
(incrémente si déjà présent)

### `PUT /basket/:basket_id/product/quantity` — Auth: ✅
**Body** `{ product_id: number; variant_id?: string; quantity: number }` → `Basket`

### `DELETE /basket/:basket_id/product` — Auth: ✅
**Body** `{ product_id: number; variant_id?: string }` → `Basket`

---

## 10. Wishlist (`/wishlist`)

### `GET /wishlist` — Auth: ✅
```ts
interface Wishlist {
  id: string; userId: number;
  items: { id: string; productId: number; variantId: string|null;
           product: { id, name, price, images: { url }[] };
           variant: { id, sku, price } | null; addedAt: string }[];
}
```

### `POST /wishlist/items` — Auth: ✅
**Body** `{ product_id: number; variant_id?: string }` → **201** `Wishlist`

### `DELETE /wishlist/items` — Auth: ✅
**Body** `{ product_id: number; variant_id?: string }` → `Wishlist`

---

## 11. Commandes (`/orders`)

### `GET /orders` — Auth: ✅
**Query** `page?, limit?, status?, customer?(email)` → `Paginated<Order>`
```ts
interface Order {
  id: string; userId: number; status: OrderStatus; totalAmount: number; discountedAmount: number|null;
  shippingAddressSnapshot: object; billingAddressSnapshot: object|null;
  items: { id: string; productId: number; quantity: number; price: number;
           originalPrice: number; discountAmount: number; product: {...} }[];
  payments: Payment[];
  appliedCoupon: { id: string; code: string; promotion: { id, name, slug } } | null;
  shippingMethod: { id: string; name: string; estimatedDays: number } | null;
  statusHistory: { id: string; fromStatus: OrderStatus|null; toStatus: OrderStatus;
                    changedBy: number|null; reason: string|null; createdAt: string }[];
  createdAt: string; updatedAt: string;
}
type OrderStatus = "PENDING"|"CONFIRMED"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"CANCELLED"|"REFUNDED";
```

### `POST /orders` — Auth: ✅
**Body**
```ts
{
  items: { id: string /* productId en string */; quantity: number }[]; // min 1
  shippingAddressId?: string;
  shippingAddress: { street: string; city: string; state?: string; country: string; postalCode: string };
  billingAddressId?: string;
  billingAddress?: { street; city; state?; country; postalCode };
  shippingMethodId?: string;
  paymentMethodId?: string;
  notes?: string;
  couponCode?: string;
}
```
**201** → `Order`

### `GET /orders/:orderId` — Auth: ✅ → `Order`
### `PUT /orders/:orderId` — Auth: ✅ — body identique à la création, tout optionnel → `Order`
### `DELETE /orders/:orderId` — Auth: ✅ → `{ message: "Order cancelled successfully" }`

### `PUT /orders/:orderId/status` 🔒 ADMIN
**Body**
```ts
{ status: OrderStatus; reason?: string; shippingCarrier?: string;
  trackingNumber?: string; estimatedDeliveryDate?: string }
```
→ `Order` mis à jour (crédite les points fidélité si passage à `DELIVERED`)

### `GET /user/:userId/orders` 🔒 ADMIN
**Query** `page?, limit?` → `Paginated<Order>`

---

## 12. Paiements (`/payments`)

### `GET /payment-methods` — Auth: ❌
```ts
{ id: string; name: string; description: string; available: boolean; message?: string }[]
// méthodes: CASH_ON_DELIVERY (available:true), PAYPAL, STRIPE, CINETPAY (available:false)
```

### `POST /payments` — Auth: ✅
**Body** `{ order_id: string; method: "CASH_ON_DELIVERY"|"PAYPAL"|"STRIPE"|"CINETPAY"; currency?: string /* XAF */; notes?: string }`
**201** → `Payment` (403 si commande d'un autre user, **503** si méthode non dispo)
```ts
interface Payment {
  id: string; orderId: string; userId: number; method: string; status: string;
  amount: number; currency: string; notes: string|null; createdAt: string; updatedAt: string;
  order: Order; user: { id, username, email, firstName, lastName };
}
```
→ passe la commande liée en `CONFIRMED`.

### `GET /payments/:payment_id` — Auth: ✅ → `Payment`
### `GET /orders/:orderId/payments` — Auth: ✅ → `Payment[]`
### `GET /payments` 🔒 ADMIN
**Query** `page?, limit?, status?, method?, order_id?` → `Paginated<Payment>`

---

## 13. Adresses (`/addresses`)

### `POST /address/validate` — Auth: ❌
**Body** `{ street: string; city: string; state?: string; country: string; postal_code: string }`
**200**
```ts
{ valid: boolean; normalized_address: { street, city, state: string|null, country, postal_code } | null }
```

### `GET /addresses` — Auth: ✅ → `Address[]`
```ts
interface Address {
  id: string; userId: number; street: string; city: string; state: string|null;
  country: string; postalCode: string; isDefault: boolean; createdAt: string; updatedAt: string;
}
```

### `GET /addresses/:addressId` — Auth: ✅ → `Address`

### `POST /addresses` — Auth: ✅
**Body** `{ street: string; city: string; state?: string; country: string; postalCode: string; isDefault?: boolean }`
**201** → `Address` (⚠️ désactive les autres si `isDefault: true`)

### `PATCH /addresses/:addressId` — Auth: ✅ — body partiel → `Address`
### `DELETE /addresses/:addressId` — Auth: ✅ → `{ message: "Address deleted successfully" }`

---

## 14. Avis (`/reviews`, `/products/:pid/reviews`)

### `GET /products/:pid/reviews` — Auth: ❌
```ts
{ product_id: number; average_rating: number; total_reviews: number; reviews: Review[] }
interface Review {
  id: string; rating: number; comment: string|null;
  user: { id, username, firstName, lastName }; createdAt: string; updatedAt: string;
}
```

### `GET /reviews/:rid` — Auth: ❌ → `Review`

### `POST /reviews` — Auth: ✅
**Body** `{ order_item_id: string; product_id: number; rating: number /* 1-5 */; comment?: string }`
**201** → `Review` (409 si déjà avisé cet achat, 403 si order_item n'appartient pas à l'user)

### `PUT /reviews/:rid` — Auth: ✅ (owner only)
**Body** `{ rating?: number; comment?: string }` → `Review`

### `DELETE /reviews/:rid` — Auth: ✅ (owner only) → `{ id: string }`

---

## 15. Promotions, remises & coupons (`/promotions`, `/coupons`)

### `GET /promotions/slug/:slug` — Auth: ❌
```ts
interface PromotionPublic {
  id: string; name: string; slug: string; description: string|null; images: string[];
  status: "SCHEDULED"|"ACTIVE"|"EXPIRED"|"CANCELLED"; isActive: boolean;
  startDate: string; endDate: string;
  discounts: { id: string; type: "PERCENTAGE"|"FIXED_AMOUNT"; value: number;
               category: { id, name, slug } | null;
               products: { product: { id, name, price } }[] }[];
  coupons: { id, code, maxUses, usedCount, perUserLimit, startDate, endDate, isActive }[];
}
```

### `POST /coupons/validate` — Auth: ✅
**Body** `{ code: string; basketId: string }`
**200**
```ts
{ valid: true; couponId: string; code: string;
  promotion: { id, name, slug }; discounts: Discount[] }
```

### `GET /promotions` 🔒 ADMIN — Query `status?, isActive?` → `Promotion[]`
### `GET /promotions/:promotionId` 🔒 ADMIN → `Promotion`

### `POST /promotions` 🔒 ADMIN
**Body**
```ts
{ name: string; slug: string; description?: string;
  startDate: string /* ISO */; endDate: string /* ISO, > startDate */; isActive?: boolean }
```
**201** → `Promotion`

### `PUT /promotions/:promotionId` 🔒 ADMIN — body partiel
### `PATCH /promotions/:promotionId/toggle` 🔒 ADMIN → `Promotion` (bascule `isActive`)
### `DELETE /promotions/:promotionId` 🔒 ADMIN → `{ message: "Promotion deleted successfully" }`

### `POST /promotions/:promotionId/images` 🔒 ADMIN — `multipart/form-data`, champ `images` (1-5 fichiers) → `Promotion`
### `DELETE /promotions/:promotionId/images` 🔒 ADMIN — Body `{ imageUrl: string }` → `Promotion`

### `POST /promotions/:promotionId/discounts` 🔒 ADMIN
**Body**
```ts
{ type: "PERCENTAGE"|"FIXED_AMOUNT"; value: number; categoryId?: string; productIds?: number[] }
// au moins categoryId OU productIds requis. value <= 100 si PERCENTAGE.
```
**201** → `Discount`

### `DELETE /promotions/:promotionId/discounts/:discountId` 🔒 ADMIN → `{ message: "Discount deleted successfully" }`

### `GET /promotions/:promotionId/coupons` 🔒 ADMIN → `CouponCode[]`

### `POST /promotions/:promotionId/coupons` 🔒 ADMIN
**Body**
```ts
{ code: string /* 3-50, auto-uppercased */; maxUses?: number; perUserLimit?: number /* défaut 1 */;
  startDate?: string; endDate?: string; isActive?: boolean }
```
**201** → `CouponCode`

### `DELETE /promotions/:promotionId/coupons/:couponId` 🔒 ADMIN → `{ message: "Coupon deleted successfully" }`

---

## 16. Expéditions (`/shipments`, `/pickup-requests`, `/labels`)

### `POST /shipments/cost` — Auth: ❌
**Body** `{ origin: string; destination: string; weight: number; dimensions?: { length, width, height } }`
**200** `{ cost: number; currency: "XAF" }`

### `POST /shipments` — Auth: ✅
**Body**
```ts
{ sender_name: string; sender_address: string; recipient_name: string; recipient_address: string;
  weight: number; dimensions?: { length, width, height }; order_id?: string; estimated_delivery_at?: string }
```
**201** → `Shipment` (avec `trackingNumber` généré)
```ts
interface Shipment {
  id: string; orderId: string|null; senderName: string; senderAddress: string;
  recipientName: string; recipientAddress: string; weight: number; dimensions: object|null;
  status: "PENDING"|"IN_TRANSIT"|"DELIVERED"|"CANCELLED"; trackingNumber: string|null;
  estimatedDeliveryDate: string|null;
  trackingEvents: { id, status, location, createdAt }[]; label: { id, labelUrl } | null;
}
```

### `GET /shipments/:shipmentId` — Auth: ✅ → `Shipment`
### `GET /shipments/:shipmentId/track` — Auth: ✅
```ts
{ current_status: string; current_location: string|null; updates: TrackingEvent[] }
```
### `POST /shipments/:shipmentId/cancel` — Auth: ✅ → `Shipment` (status `CANCELLED`)
### `GET /labels/:shipmentId` — Auth: ✅ → `{ label_id: string; label_url: string }`

### `POST /pickup-requests` — Auth: ✅
**Body** `{ pickup_date: string; pickup_address: string }` → **201**
```ts
interface PickupRequest {
  id: string; userId: number; pickupDate: string; pickupAddress: string;
  status: "PENDING"|"CONFIRMED"|"CANCELLED";
}
```
### `GET /pickup-requests/:requestId` — Auth: ✅ → `PickupRequest`
### `POST /pickup-requests/:requestId/cancel` — Auth: ✅ (owner only) → `PickupRequest`

### `GET /shipments` 🔒 ADMIN — Query `page?, limit?, status?` → `Paginated<Shipment>`
### `POST /shipments/:shipmentId/track` 🔒 ADMIN
**Body** `{ status: string; location?: string }` → `Shipment` mis à jour

---

## 17. Méthodes de livraison (`/shipping-methods`)

### `GET /shipping-methods` — Auth: ❌ — Query `active?: boolean` → `ShippingMethod[]`
```ts
interface ShippingMethod {
  id: string; name: string; description: string|null; estimatedDays: number;
  basePrice: number; pricePerKg: number; isActive: boolean; zones: string[];
}
```
### `GET /shipping-methods/:methodId` — Auth: ❌ → `ShippingMethod`

### `POST /shipping-methods` 🔒 ADMIN
**Body**
```ts
{ name: string; description?: string; estimatedDays: number; basePrice: number;
  pricePerKg?: number; isActive?: boolean; zones: string[] /* codes pays 2 lettres, min 1 */ }
```
**201** → `ShippingMethod`

### `PATCH /shipping-methods/:methodId` 🔒 ADMIN — body partiel
### `DELETE /shipping-methods/:methodId` 🔒 ADMIN → `{ message: "Shipping method deleted successfully" }`

### `POST /shipping-methods/calculate` — Auth: ❌
**Body** `{ shippingMethodId: string; weight: number }`
**200** `{ shippingMethodId, name, estimatedDays, cost, currency: "XAF" }`

---

## 18. Inventaire (`/inventory`)

### `GET /inventory` — Auth: ✅
**Query** `page?, limit?, category?, location?` → `Paginated<InventoryItem>`
```ts
interface InventoryItem {
  id: string; productId: number; variantId: string|null; warehouseId: string; quantity: number;
  product: Product; warehouse: Warehouse; variant: Variant|null;
}
```
### `GET /inventory/low-stock` — Auth: ✅ — Query `threshold?: number /* défaut 10 */` → `InventoryItem[]`
### `GET /inventory/out-of-stock` — Auth: ✅ → `InventoryItem[]`
### `GET /inventory/search` — Auth: ✅ — Query `keyword: string` (requis) → `InventoryItem[]`
### `GET /inventory/:item_id` — Auth: ✅ → `InventoryItem`

### `POST /inventory` 🔒 ADMIN
**Body** `{ product_id: number; warehouse_id: string; variant_id?: string; quantity?: number /* défaut 0 */ }`
**201** → `InventoryItem` (409 si doublon produit/entrepôt/variant)

### `PUT /inventory/:item_id` 🔒 ADMIN
**Body** `{ quantity?: number; warehouse_id?: string }` → `InventoryItem`

### `DELETE /inventory/:item_id` 🔒 ADMIN → `{ message: "Inventory item deleted successfully" }`

### `POST /inventory/transfer` 🔒 ADMIN
**Body** `{ item_id: string; from_warehouse: string; to_warehouse: string; quantity: number }`
**200** `{ item_id, from_warehouse, to_warehouse, quantity }`

---

## 19. Entrepôts (`/warehouses`)

### `GET /warehouses` — Auth: ✅ → `Warehouse[]`
```ts
interface Warehouse { id: string; name: string; location: string; capacity: number|null }
```
### `GET /warehouses/:warehouse_id` — Auth: ✅ → `Warehouse`
### `GET /warehouses/:warehouse_id/inventory` — Auth: ✅
```ts
{ warehouse: Warehouse & { totalUnits: number }; items: InventoryItem[] }
```

### `POST /warehouses` 🔒 ADMIN — Body `{ name: string; location: string; capacity?: number }` → **201**
### `PUT /warehouses/:warehouse_id` 🔒 ADMIN — body partiel
### `DELETE /warehouses/:warehouse_id` 🔒 ADMIN → `{ message: "Warehouse deleted successfully" }`

---

## 20. Retours (`/returns`)

### `GET /returns/:returnId` — Auth: ✅ (owner ou admin) → `ReturnRequest`
```ts
interface ReturnRequest {
  id: string; orderId: string; userId: number; status: "PENDING"|"APPROVED"|"REJECTED"|"COMPLETED";
  reason: string; notes: string|null;
  items: { id: string; orderItemId: string; quantity: number; condition: string|null;
            orderItem: { id, productId, quantity, price } }[];
  order: { id, userId, status };
}
```

### `POST /returns` — Auth: ✅
**Body**
```ts
{ order_id: string; reason: string; notes?: string;
  items: { order_item_id: string; quantity: number; condition?: string }[] } // min 1
```
**201** → `ReturnRequest`

### `GET /orders/:orderId/returns` — Auth: ✅ → `ReturnRequest[]`
### `GET /returns` 🔒 ADMIN — Query `page?, limit?, status?` → `Paginated<ReturnRequest>`
### `PUT /returns/:returnId/status` 🔒 ADMIN
**Body** `{ status: "PENDING"|"APPROVED"|"REJECTED"|"COMPLETED"; notes?: string }` → `ReturnRequest`

---

## 21. Programme fidélité (`/loyalty`)

### `GET /loyalty/:userId/balance` — Auth: ✅ → `{ userId: number; balance: number }`
### `GET /loyalty/:userId/history` — Auth: ✅
```ts
{ id: string; points: number; type: "EARNED"|"REDEEMED"|"EXPIRED"|"ADJUSTED";
  orderId: string|null; createdAt: string }[]
```
### `POST /loyalty/adjust` 🔒 ADMIN
**Body** `{ userId: number; points: number /* != 0, négatif pour un débit */; type: "EARNED"|"REDEEMED"|"EXPIRED"|"ADJUSTED"; orderId?: string }`
**201** → transaction créée

---

## 22. Dashboard (`/dashboard`) 🔒 ADMIN

### `GET /dashboard/stats`
```ts
{
  products: { total: number; addedThisMonth: number };
  orders: { total: number; thisMonth: number; trend: number /* % */ };
  users: { total: number; active: number };
  payments: { totalAmountThisMonth: number; currency: "XAF"; trend: number };
  inventory: { lowStockCount: number };
  shipments: { inProgress: number; trend: number };
  promotions: { active: number; couponUsageThisMonth: number; revenueFromCouponsThisMonth: number; currency: "XAF" };
}
```

### `GET /dashboard/sales-chart`
**Query** `year?: number, period?: "monthly"`
```ts
{ period: string; year: number; currency: "XAF";
  points: { label: string; amount: number; orderCount: number }[] }
```

---

## 23. Récapitulatif rapide (routes par méthode)

| Domaine | Public | User connecté | Admin |
|---|---|---|---|
| Auth | signup, login | — | — |
| Produits | GET list/detail | — | POST/PATCH/DELETE, images |
| Catégories | GET slug | GET list/detail | POST/PUT/DELETE |
| Panier / Wishlist | — | tout | — |
| Commandes | — | CRUD (own) | change status, list par user |
| Paiements | GET methods | create/list own | GET all |
| Adresses | validate | CRUD (own) | — |
| Avis | GET | CRUD (own) | — |
| Promotions | GET slug, validate coupon | — | CRUD complet |
| Expéditions | cost | create/track/cancel/pickup | list all, add tracking |
| Inventaire/Entrepôts | — | lecture | écriture |
| Retours | — | create/list (own) | list all, change status |
| Fidélité | — | lecture (balance/history) | adjust |
| Dashboard | — | — | tout |

---

## 24. Notes d'intégration frontend

- Toujours parser la réponse via l'enveloppe `{ status, data }` / `{ status, error }`.
- Stocker le `token` JWT (ex. `localStorage`/cookie sécurisé) et l'attacher en header `Authorization: Bearer <token>` sur toutes les routes protégées.
- `page`/`limit` : toujours convertis en `number` côté API à partir de query strings.
- Les montants sont des `number` en XAF (pas de sous-unités, pas de formatage — à formater côté front).
- `GET /inventory` renvoie un objet paginé, contrairement à d'autres endpoints "list" simples qui renvoient un tableau brut (ex : `GET /categories`, `GET /warehouses`) — bien vérifier le shape avant de mapper.
- CORS : penser à whitelister le port du frontend en dev + le domaine de prod côté backend.
