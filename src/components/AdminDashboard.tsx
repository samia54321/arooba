import React, { useState, useEffect } from 'react';
import {
  X, Plus, Edit2, Trash2, CheckCircle2, Clock, Flame, Bike, PackageCheck,
  DollarSign, TrendingUp, ShoppingBag, Database, AlertCircle, RefreshCw, Eye
} from 'lucide-react';
import { Pizza, Order, AdminStats, DbStatusInfo } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface AdminDashboardProps {
  onClose: () => void;
  onOpenMongoSetup: () => void;
  onRefreshMenu: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onOpenMongoSetup,
  onRefreshMenu
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'pizzas' | 'stats'>('orders');

  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatusInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Pizza Form Modal State
  const [isEditingPizza, setIsEditingPizza] = useState(false);
  const [editingPizzaId, setEditingPizzaId] = useState<string | null>(null);
  const [pizzaForm, setPizzaForm] = useState({
    name: '',
    description: '',
    price: 18.00,
    category: 'Specialty' as Pizza['category'],
    image: '/src/assets/images/pizza_margherita_classic_1791819140145.jpg',
    ingredients: '',
    isVegetarian: false,
    isSpicy: false,
    isPopular: false,
    inStock: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, pizzasRes, statsRes, dbRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/pizzas'),
        fetch('/api/stats'),
        fetch('/api/stats/status')
      ]);

      const [ordersData, pizzasData, statsData, dbData] = await Promise.all([
        ordersRes.json(),
        pizzasRes.json(),
        statsRes.json(),
        dbRes.json()
      ]);

      if (ordersData.success) setOrders(ordersData.data);
      if (pizzasData.success) setPizzas(pizzasData.data);
      if (statsData.success) setStats(statsData.data);
      if (dbData.success) setDbStatus(dbData.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => (o.id === orderId || o.orderNumber === orderId ? data.data : o)));
        fetchData(); // refresh stats
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleSavePizza = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...pizzaForm,
        price: Number(pizzaForm.price),
        ingredients: pizzaForm.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        sizes: {
          personal: Number((pizzaForm.price * 0.85).toFixed(2)),
          classic: Number(pizzaForm.price),
          grande: Number((pizzaForm.price * 1.3).toFixed(2))
        },
        crusts: ['Traditional Neapolitan', 'Crispy Thin', 'Garlic Butter Stuffed']
      };

      if (editingPizzaId) {
        // Update
        const res = await fetch(`/api/pizzas/${editingPizzaId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setIsEditingPizza(false);
          fetchData();
          onRefreshMenu();
        }
      } else {
        // Create
        const res = await fetch('/api/pizzas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setIsEditingPizza(false);
          fetchData();
          onRefreshMenu();
        }
      }
    } catch (err) {
      console.error('Failed to save pizza:', err);
    }
  };

  const handleDeletePizza = async (id: string) => {
    if (!confirm('Are you sure you want to remove this pizza from the menu?')) return;
    try {
      const res = await fetch(`/api/pizzas/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPizzas(prev => prev.filter(p => p.id !== id && p._id !== id));
        fetchData();
        onRefreshMenu();
      }
    } catch (err) {
      console.error('Failed to delete pizza:', err);
    }
  };

  const handleToggleStock = async (pizza: Pizza) => {
    try {
      const id = pizza.id || pizza._id;
      const res = await fetch(`/api/pizzas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !pizza.inStock })
      });
      const data = await res.json();
      if (data.success) {
        setPizzas(prev => prev.map(p => (p.id === id || p._id === id ? data.data : p)));
        onRefreshMenu();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openCreatePizza = () => {
    setEditingPizzaId(null);
    setPizzaForm({
      name: '',
      description: '',
      price: 18.00,
      category: 'Specialty',
      image: '/src/assets/images/pizza_margherita_classic_1791819140145.jpg',
      ingredients: 'San Marzano Tomatoes, Fior di Latte, Basil, EVOO',
      isVegetarian: false,
      isSpicy: false,
      isPopular: false,
      inStock: true
    });
    setIsEditingPizza(true);
  };

  const openEditPizza = (pizza: Pizza) => {
    setEditingPizzaId(pizza.id || pizza._id || '');
    setPizzaForm({
      name: pizza.name,
      description: pizza.description,
      price: pizza.price,
      category: pizza.category,
      image: pizza.image,
      ingredients: pizza.ingredients ? pizza.ingredients.join(', ') : '',
      isVegetarian: pizza.isVegetarian,
      isSpicy: pizza.isSpicy,
      isPopular: pizza.isPopular,
      inStock: pizza.inStock
    });
    setIsEditingPizza(true);
  };

  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-6xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-[#E8DFD0] flex flex-col">
        {/* Header Bar */}
        <div className="p-5 border-b border-[#E8DFD0] flex items-center justify-between bg-[#FAF7F2] shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#C82D2D] text-white flex items-center justify-center font-bold shadow-xs">
              <Flame className="w-5 h-5 fill-current" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif-title font-bold text-[#1F1D1D]">
                  Chef & Restaurant Administration
                </h2>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Live Operations
                </span>
              </div>
              <p className="text-xs text-[#78716C]">
                Logged in as Master Chef: {user?.name || 'Marco Bellini'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* MongoDB status quick button */}
            <button
              onClick={onOpenMongoSetup}
              className={`py-1.5 px-3 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors shadow-2xs ${
                dbStatus?.isMongoConnected
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{dbStatus?.isMongoConnected ? 'MongoDB Live' : 'Database Setup'}</span>
            </button>

            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 text-[#78716C] hover:text-[#1F1D1D] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#E8DFD0]"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onClose}
              aria-label="Close admin dashboard"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:text-[#1F1D1D] hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#FDF9F3] border-b border-[#E8DFD0] shrink-0 text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#E8DFD0] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">Total Sales</span>
            <span className="text-xl font-bold text-[#1F1D1D] tabular-nums">${stats?.totalRevenue.toFixed(2) || '0.00'}</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E8DFD0] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">Total Orders</span>
            <span className="text-xl font-bold text-[#1F1D1D] tabular-nums">{stats?.totalOrders || 0}</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E8DFD0] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">Active in Oven / Transit</span>
            <span className="text-xl font-bold text-[#C82D2D] tabular-nums">{stats?.activeOrders || 0}</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E8DFD0] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">Menu Pizzas</span>
            <span className="text-xl font-bold text-[#1F1D1D] tabular-nums">{pizzas.length}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E8DFD0] bg-white px-5 shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 text-xs font-bold border-b-2 transition-all mr-6 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#C82D2D] text-[#C82D2D]'
                : 'border-transparent text-[#78716C] hover:text-[#1F1D1D]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Orders Pipeline ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pizzas')}
            className={`py-3 text-xs font-bold border-b-2 transition-all mr-6 flex items-center gap-2 ${
              activeTab === 'pizzas'
                ? 'border-[#C82D2D] text-[#C82D2D]'
                : 'border-transparent text-[#78716C] hover:text-[#1F1D1D]'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Manage Pizza Catalog ({pizzas.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'stats'
                ? 'border-[#C82D2D] text-[#C82D2D]'
                : 'border-transparent text-[#78716C] hover:text-[#1F1D1D]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Kitchen Analytics</span>
          </button>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="p-5 flex-grow overflow-y-auto space-y-4">
            {/* Filter controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FAF7F2] rounded-xl border border-[#E8DFD0] text-xs">
                {['all', 'pending', 'preparing', 'baking', 'out_for_delivery', 'delivered', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`py-1.5 px-3 rounded-lg font-medium capitalize transition-colors ${
                      orderStatusFilter === status
                        ? 'bg-white text-[#C82D2D] shadow-2xs font-bold'
                        : 'text-[#78716C] hover:text-[#1F1D1D]'
                    }`}
                  >
                    {status.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              <span className="text-xs text-[#78716C]">
                Showing {filteredOrders.length} order(s)
              </span>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-[#78716C] text-xs">
                No orders found under this filter state.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map(order => (
                  <div
                    key={order.id || order.orderNumber}
                    className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8DFD0] hover:border-[#D6C7B2] transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFE5D5] pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#1F1D1D]">{order.orderNumber}</span>
                          <span className="text-xs font-semibold text-[#57534E]">· {order.customerName}</span>
                          <span className="text-xs text-[#78716C]">({order.customerPhone})</span>
                        </div>
                        <span className="text-[11px] text-[#78716C] block mt-0.5">
                          {order.orderType === 'delivery'
                            ? `🚴 Delivery to: ${order.address?.street || 'Customer address'}, ${order.address?.city || ''}`
                            : '🍕 Customer Pickup at Counter'}
                        </span>
                      </div>

                      {/* Status changer select */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#78716C]">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id || order.orderNumber, e.target.value as Order['status'])}
                          className="text-xs font-bold py-1.5 px-3 bg-white border border-[#E8DFD0] rounded-lg focus:ring-1 focus:ring-[#C82D2D]"
                        >
                          <option value="pending">⏳ Pending Acceptance</option>
                          <option value="preparing">🥣 Hand Stretching Dough</option>
                          <option value="baking">🔥 In 900°F Stone Oven</option>
                          <option value="out_for_delivery">🚴 Out for Delivery</option>
                          <option value="delivered">✅ Delivered & Closed</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                        <span className="text-sm font-bold text-[#1F1D1D] tabular-nums ml-2">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-lg border border-[#E8DFD0]">
                          <p className="font-bold text-[#1F1D1D]">
                            {item.quantity}x {item.name} <span className="font-normal text-[#78716C]">({item.size})</span>
                          </p>
                          <p className="text-[11px] text-[#78716C]">{item.crust}</p>
                          {item.extraToppings?.length ? (
                            <p className="text-[11px] text-[#C82D2D]">+ {item.extraToppings.join(', ')}</p>
                          ) : null}
                          {item.specialInstructions && (
                            <p className="text-[11px] italic text-[#A8A29E]">Note: "{item.specialInstructions}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Pizza CRUD Catalog */}
        {activeTab === 'pizzas' && (
          <div className="p-5 flex-grow overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1F1D1D]">Live Wood-Fired Menu Items</h3>
                <p className="text-xs text-[#78716C]">Update recipes, toggle stock, or add seasonal creations</p>
              </div>
              <button
                onClick={openCreatePizza}
                className="py-2 px-4 bg-[#C82D2D] hover:bg-[#B32424] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Pizza</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pizzas.map(pizza => (
                <div
                  key={pizza.id || pizza._id}
                  className="bg-[#FAF7F2] border border-[#E8DFD0] rounded-xl overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-36 bg-[#F5EFE6]">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="bg-white/95 text-[#C82D2D] text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                        {pizza.category}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleToggleStock(pizza)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs cursor-pointer ${
                          pizza.inStock
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {pizza.inStock ? 'In Stock' : 'Sold Out'}
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-[#1F1D1D] leading-snug">{pizza.name}</h4>
                        <span className="text-xs font-bold text-[#1F1D1D] tabular-nums">${pizza.price.toFixed(2)}</span>
                      </div>
                      <p className="text-[11px] text-[#57534E] line-clamp-2 mt-1">{pizza.description}</p>
                    </div>

                    <div className="pt-2 border-t border-[#EFE5D5] flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditPizza(pizza)}
                        className="py-1 px-2.5 bg-white border border-[#E8DFD0] hover:border-[#D6C7B2] rounded-lg text-xs font-semibold text-[#57534E] flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeletePizza(pizza.id || pizza._id || '')}
                        className="py-1 px-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Analytics */}
        {activeTab === 'stats' && (
          <div className="p-6 flex-grow overflow-y-auto space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#1F1D1D] mb-1">Top Selling Artisan Pizzas</h3>
              <p className="text-xs text-[#78716C] mb-4">Volume rank based on all completed and active customer orders</p>
              {stats?.topPizzas?.length ? (
                <div className="space-y-2">
                  {stats.topPizzas.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-[#FAF7F2] border border-[#E8DFD0] rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#C82D2D] text-white flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-[#1F1D1D]">{item.name}</span>
                      </div>
                      <span className="font-semibold text-[#C82D2D] tabular-nums">
                        {item.count} ordered
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#78716C]">Order data will populate popularity chart as orders are placed.</p>
              )}
            </div>

            <div className="p-4 bg-[#FAF7F2] border border-[#E8DFD0] rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider">Database Architecture</h4>
              <p className="text-xs text-[#57534E]">
                Driver: <strong>{dbStatus?.storageType === 'mongodb' ? 'Mongoose on MongoDB' : 'Persistent Resilient Storage (MongoDB Hybrid)'}</strong>
              </p>
              <p className="text-xs text-[#57534E]">
                Configured URI: <strong>{dbStatus?.hasMongoUriConfigured ? 'Yes (MONGODB_URI set)' : 'No (Ready for connection)'}</strong>
              </p>
              <button
                onClick={onOpenMongoSetup}
                className="mt-2 py-1.5 px-3 bg-[#C82D2D] text-white rounded-lg text-xs font-semibold"
              >
                View MongoDB Connection Instructions
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Pizza Sub-Modal */}
      {isEditingPizza && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#E8DFD0]">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#E8DFD0]">
              <h3 className="text-lg font-serif-title font-bold text-[#1F1D1D]">
                {editingPizzaId ? 'Edit Pizza Recipe' : 'Add New Artisan Pizza'}
              </h3>
              <button onClick={() => setIsEditingPizza(false)} className="text-[#78716C] hover:text-[#1F1D1D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePizza} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1F1D1D] block mb-1">Pizza Name *</label>
                <input
                  type="text"
                  required
                  value={pizzaForm.name}
                  onChange={(e) => setPizzaForm({ ...pizzaForm, name: e.target.value })}
                  placeholder="e.g. Salsiccia & Friarielli"
                  className="w-full p-2.5 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1F1D1D] block mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={pizzaForm.description}
                  onChange={(e) => setPizzaForm({ ...pizzaForm, description: e.target.value })}
                  placeholder="Artisanal description of ingredients and wood-fired crust..."
                  className="w-full p-2.5 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1F1D1D] block mb-1">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={pizzaForm.price}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1F1D1D] block mb-1">Category *</label>
                  <select
                    value={pizzaForm.category}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, category: e.target.value as Pizza['category'] })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
                  >
                    <option value="Classic">Classic</option>
                    <option value="Specialty">Specialty</option>
                    <option value="White & Truffle">White & Truffle</option>
                    <option value="Spicy">Spicy</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1F1D1D] block mb-1">Image URL / Asset</label>
                <select
                  value={pizzaForm.image}
                  onChange={(e) => setPizzaForm({ ...pizzaForm, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
                >
                  <option value="/src/assets/images/pizza_margherita_classic_1791819140145.jpg">Classic Margherita</option>
                  <option value="/src/assets/images/pizza_spicy_diavola_1791819170170.jpg">Spicy Diavola</option>
                  <option value="/src/assets/images/pizza_truffle_mushroom_1791819154217.jpg">Truffle & Mushroom</option>
                  <option value="/src/assets/images/hero_artisanal_pizza_1791819121869.jpg">Wood-Fired Signature</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1F1D1D] block mb-1">Ingredients (comma separated)</label>
                <input
                  type="text"
                  value={pizzaForm.ingredients}
                  onChange={(e) => setPizzaForm({ ...pizzaForm, ingredients: e.target.value })}
                  placeholder="San Marzano, Mozzarella, Basil, Olive Oil"
                  className="w-full p-2.5 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pizzaForm.isVegetarian}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, isVegetarian: e.target.checked })}
                    className="rounded text-[#C82D2D]"
                  />
                  <span>Vegetarian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pizzaForm.isSpicy}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, isSpicy: e.target.checked })}
                    className="rounded text-[#C82D2D]"
                  />
                  <span>Spicy</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pizzaForm.isPopular}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, isPopular: e.target.checked })}
                    className="rounded text-[#C82D2D]"
                  />
                  <span>Popular Badge</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8DFD0]">
                <button
                  type="button"
                  onClick={() => setIsEditingPizza(false)}
                  className="py-2 px-4 rounded-xl border border-[#E8DFD0] text-[#78716C] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#C82D2D] text-white font-bold hover:bg-[#B32424]"
                >
                  Save Pizza
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
