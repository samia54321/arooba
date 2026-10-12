import mongoose, { Schema } from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { IPizza, IOrder, IUser } from './models/types.ts';
import { INITIAL_PIZZAS, INITIAL_USERS } from './seedData.ts';

// Data directory for local persistence fallback
const DATA_DIR = path.resolve(process.cwd(), '.data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Could not create local data dir:', err);
  }
}

const PIZZAS_FILE = path.join(DATA_DIR, 'pizzas.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Mongoose Schemas
const PizzaMongooseSchema = new Schema<IPizza>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  ingredients: [{ type: String }],
  isVegetarian: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  sizes: {
    personal: { type: Number, required: true },
    classic: { type: Number, required: true },
    grande: { type: Number, required: true }
  },
  crusts: [{ type: String }],
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const OrderItemSchema = new Schema({
  pizzaId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  crust: { type: String, required: true },
  extraToppings: [{ type: String }],
  quantity: { type: Number, required: true },
  specialInstructions: { type: String }
});

const OrderMongooseSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  orderType: { type: String, enum: ['delivery', 'pickup'], required: true },
  address: {
    street: String,
    city: String,
    zipCode: String,
    notes: String
  },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  tip: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['card', 'cod', 'apple_pay'], required: true },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'baking', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: String, default: () => new Date().toISOString() },
  estimatedDeliveryTime: String,
  userId: String
}, { timestamps: true });

const UserMongooseSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone: String,
  address: String,
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

export const PizzaModel = mongoose.models.Pizza || mongoose.model<IPizza>('Pizza', PizzaMongooseSchema);
export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderMongooseSchema);
export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserMongooseSchema);

// Connection status tracker
export const dbStatus = {
  isMongoConnected: false,
  mongoUri: process.env.MONGODB_URI || '',
  storageType: 'file_backed' as 'mongodb' | 'file_backed',
  lastError: null as string | null,
  connectedAt: null as string | null
};

// In-memory / file cached store
let cachedPizzas: IPizza[] = [];
let cachedOrders: IOrder[] = [];
let cachedUsers: IUser[] = [];

function loadFromFile<T>(filePath: string, defaultData: T[]): T[] {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  } catch (err) {
    console.error(`Error loading ${filePath}:`, err);
    return defaultData;
  }
}

function saveToFile<T>(filePath: string, data: T[]) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error saving ${filePath}:`, err);
  }
}

// Initialize cached data
cachedPizzas = loadFromFile(PIZZAS_FILE, INITIAL_PIZZAS);
cachedOrders = loadFromFile(ORDERS_FILE, []);
cachedUsers = loadFromFile(USERS_FILE, INITIAL_USERS);

// Attempt MongoDB Connection
export async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('⚡ No MONGODB_URI configured. Running in active resilient local storage mode (seamless MongoDB migration ready).');
    dbStatus.storageType = 'file_backed';
    return;
  }

  try {
    console.log(`🔌 Attempting to connect to MongoDB...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    dbStatus.isMongoConnected = true;
    dbStatus.storageType = 'mongodb';
    dbStatus.connectedAt = new Date().toISOString();
    console.log('✅ MongoDB connected successfully to database:', mongoose.connection.name);

    // Seed MongoDB if empty
    const pizzaCount = await PizzaModel.countDocuments();
    if (pizzaCount === 0) {
      console.log('🌱 Seeding MongoDB with initial pizzas...');
      await PizzaModel.insertMany(INITIAL_PIZZAS);
    }
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding MongoDB with initial users...');
      await UserModel.insertMany(INITIAL_USERS);
    }
  } catch (err: any) {
    dbStatus.isMongoConnected = false;
    dbStatus.storageType = 'file_backed';
    dbStatus.lastError = err?.message || 'MongoDB connection failed';
    console.warn(`⚠️ MongoDB connection unavailable (${err.message}). Defaulting seamlessly to local persistent storage.`);
  }
}

// Unified repository methods that work across MongoDB & Persistent Storage
export const db = {
  // Pizzas
  async getPizzas(query?: { category?: string; search?: string }): Promise<IPizza[]> {
    if (dbStatus.isMongoConnected) {
      try {
        const filter: any = {};
        if (query?.category && query.category !== 'All') {
          filter.category = query.category;
        }
        if (query?.search) {
          filter.$or = [
            { name: { $regex: query.search, $options: 'i' } },
            { description: { $regex: query.search, $options: 'i' } },
            { ingredients: { $regex: query.search, $options: 'i' } }
          ];
        }
        const docs = await PizzaModel.find(filter).lean();
        return docs.map(doc => ({ ...doc, id: doc._id.toString() }));
      } catch (err) {
        console.warn('MongoDB query failed, falling back to cache:', err);
      }
    }

    let result = [...cachedPizzas];
    if (query?.category && query.category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === query.category!.toLowerCase());
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.ingredients.some(i => i.toLowerCase().includes(q))
      );
    }
    return result;
  },

  async getPizzaById(id: string): Promise<IPizza | null> {
    if (dbStatus.isMongoConnected) {
      try {
        const doc = await PizzaModel.findById(id).lean();
        if (doc) return { ...doc, id: doc._id.toString() };
      } catch (err) {
        // Fallback to cache lookup
      }
    }
    const pizza = cachedPizzas.find(p => p.id === id || p._id === id);
    return pizza || null;
  },

  async createPizza(data: Omit<IPizza, 'id' | '_id'>): Promise<IPizza> {
    if (dbStatus.isMongoConnected) {
      try {
        const doc = await PizzaModel.create(data);
        const saved = doc.toObject();
        return { ...saved, id: saved._id.toString() };
      } catch (err) {
        console.error('MongoDB create failed:', err);
      }
    }

    const newPizza: IPizza = {
      ...data,
      id: `pizza-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    cachedPizzas.unshift(newPizza);
    saveToFile(PIZZAS_FILE, cachedPizzas);
    return newPizza;
  },

  async updatePizza(id: string, updates: Partial<IPizza>): Promise<IPizza | null> {
    if (dbStatus.isMongoConnected) {
      try {
        const doc = await PizzaModel.findByIdAndUpdate(id, updates, { new: true }).lean();
        if (doc) return { ...doc, id: doc._id.toString() };
      } catch (err) {
        console.error('MongoDB update failed:', err);
      }
    }

    const index = cachedPizzas.findIndex(p => p.id === id || p._id === id);
    if (index === -1) return null;
    cachedPizzas[index] = { ...cachedPizzas[index], ...updates };
    saveToFile(PIZZAS_FILE, cachedPizzas);
    return cachedPizzas[index];
  },

  async deletePizza(id: string): Promise<boolean> {
    if (dbStatus.isMongoConnected) {
      try {
        const res = await PizzaModel.findByIdAndDelete(id);
        if (res) return true;
      } catch (err) {
        console.error('MongoDB delete failed:', err);
      }
    }

    const prevLen = cachedPizzas.length;
    cachedPizzas = cachedPizzas.filter(p => p.id !== id && p._id !== id);
    if (cachedPizzas.length !== prevLen) {
      saveToFile(PIZZAS_FILE, cachedPizzas);
      return true;
    }
    return false;
  },

  // Orders
  async getOrders(userId?: string): Promise<IOrder[]> {
    if (dbStatus.isMongoConnected) {
      try {
        const filter = userId ? { userId } : {};
        const docs = await OrderModel.find(filter).sort({ createdAt: -1 }).lean();
        return docs.map(doc => ({ ...doc, id: doc._id.toString() }));
      } catch (err) {
        console.warn('MongoDB orders query failed:', err);
      }
    }

    let list = [...cachedOrders];
    if (userId) {
      list = list.filter(o => o.userId === userId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getOrderById(id: string): Promise<IOrder | null> {
    if (dbStatus.isMongoConnected) {
      try {
        const doc = await OrderModel.findOne({ $or: [{ _id: id }, { orderNumber: id }] }).lean();
        if (doc) return { ...doc, id: doc._id.toString() };
      } catch (err) {
        // fallback
      }
    }
    const order = cachedOrders.find(o => o.id === id || o._id === id || o.orderNumber === id);
    return order || null;
  },

  async createOrder(data: Omit<IOrder, 'id' | '_id' | 'orderNumber' | 'createdAt'>): Promise<IOrder> {
    const orderNumber = `VF-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullOrder: IOrder = {
      ...data,
      orderNumber,
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (dbStatus.isMongoConnected) {
      try {
        const doc = await OrderModel.create(fullOrder);
        const saved = doc.toObject();
        return { ...saved, id: saved._id.toString() };
      } catch (err) {
        console.error('MongoDB order create failed:', err);
      }
    }

    fullOrder.id = `order-${Date.now()}`;
    cachedOrders.unshift(fullOrder);
    saveToFile(ORDERS_FILE, cachedOrders);
    return fullOrder;
  },

  async updateOrderStatus(id: string, status: IOrder['status']): Promise<IOrder | null> {
    if (dbStatus.isMongoConnected) {
      try {
        const doc = await OrderModel.findOneAndUpdate(
          { $or: [{ _id: id }, { orderNumber: id }] },
          { status },
          { new: true }
        ).lean();
        if (doc) return { ...doc, id: doc._id.toString() };
      } catch (err) {
        console.error('MongoDB order status update failed:', err);
      }
    }

    const order = cachedOrders.find(o => o.id === id || o._id === id || o.orderNumber === id);
    if (!order) return null;
    order.status = status;
    saveToFile(ORDERS_FILE, cachedOrders);
    return order;
  },

  // Users
  async findUserByEmail(email: string): Promise<IUser | null> {
    if (dbStatus.isMongoConnected) {
      try {
        const doc = await UserModel.findOne({ email: email.toLowerCase() }).lean();
        if (doc) return { ...doc, id: doc._id.toString() };
      } catch (err) {
        // fallback
      }
    }
    const user = cachedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  async createUser(data: Omit<IUser, 'id' | '_id' | 'createdAt'>): Promise<IUser> {
    const userData: IUser = {
      ...data,
      email: data.email.toLowerCase(),
      createdAt: new Date().toISOString()
    };

    if (dbStatus.isMongoConnected) {
      try {
        const doc = await UserModel.create(userData);
        const saved = doc.toObject();
        return { ...saved, id: saved._id.toString() };
      } catch (err) {
        console.error('MongoDB user create failed:', err);
      }
    }

    userData.id = `user-${Date.now()}`;
    cachedUsers.push(userData);
    saveToFile(USERS_FILE, cachedUsers);
    return userData;
  },

  // Stats
  async getStats() {
    const orders = await this.getOrders();
    const pizzas = await this.getPizzas();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const activeOrders = orders.filter(o => ['pending', 'preparing', 'baking', 'out_for_delivery'].includes(o.status)).length;
    
    // Top pizzas count
    const pizzaCounts: Record<string, { count: number; name: string }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!pizzaCounts[item.pizzaId]) {
          pizzaCounts[item.pizzaId] = { count: 0, name: item.name };
        }
        pizzaCounts[item.pizzaId].count += item.quantity;
      });
    });

    const topPizzas = Object.entries(pizzaCounts)
      .map(([id, val]) => ({ id, name: val.name, count: val.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders: orders.length,
      completedOrders,
      activeOrders,
      totalPizzas: pizzas.length,
      topPizzas
    };
  }
};
