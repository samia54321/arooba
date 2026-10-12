export interface Pizza {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: 'Classic' | 'Specialty' | 'White & Truffle' | 'Spicy' | 'Vegan';
  image: string;
  ingredients: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  inStock: boolean;
  sizes: {
    personal: number;
    classic: number;
    grande: number;
  };
  crusts: string[];
  createdAt?: string;
}

export type PizzaSize = 'personal' | 'classic' | 'grande';

export interface CartExtra {
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart line item id
  pizzaId: string;
  name: string;
  basePrice: number;
  size: PizzaSize;
  sizePrice: number;
  crust: string;
  extraToppings: CartExtra[];
  quantity: number;
  itemTotal: number;
  specialInstructions?: string;
  image: string;
}

export interface OrderItem {
  pizzaId: string;
  name: string;
  price: number;
  size: PizzaSize;
  crust: string;
  extraToppings: string[];
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  _id?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup';
  address?: {
    street: string;
    city: string;
    zipCode: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip: number;
  total: number;
  paymentMethod: 'card' | 'cod' | 'apple_pay';
  status: 'pending' | 'preparing' | 'baking' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDeliveryTime?: string;
  userId?: string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  activeOrders: number;
  totalPizzas: number;
  topPizzas: { id: string; name: string; count: number }[];
}

export interface DbStatusInfo {
  isMongoConnected: boolean;
  storageType: 'mongodb' | 'file_backed';
  hasMongoUriConfigured: boolean;
  connectedAt: string | null;
  lastError: string | null;
}
