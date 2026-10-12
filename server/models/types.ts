export interface IPizza {
  _id?: string;
  id?: string;
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
    personal: number; // 10"
    classic: number;  // 12"
    grande: number;   // 14"
  };
  crusts: string[];
  createdAt?: string;
}

export interface IOrderItem {
  pizzaId: string;
  name: string;
  price: number;
  size: 'personal' | 'classic' | 'grande';
  crust: string;
  extraToppings: string[];
  quantity: number;
  specialInstructions?: string;
}

export interface IOrder {
  _id?: string;
  id?: string;
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
  items: IOrderItem[];
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

export interface IUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
  createdAt: string;
}
