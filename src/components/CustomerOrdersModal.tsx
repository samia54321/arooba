import React, { useState, useEffect } from 'react';
import { X, Clock, ShoppingBag, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { Order } from '../types.ts';

interface CustomerOrdersModalProps {
  onClose: () => void;
  onTrackOrder: (order: Order) => void;
}

export const CustomerOrdersModal: React.FC<CustomerOrdersModalProps> = ({ onClose, onTrackOrder }) => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = user?.id ? `/api/orders?userId=${user.id}` : '/api/orders';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addItem({
        pizzaId: item.pizzaId,
        name: item.name,
        basePrice: item.price,
        size: item.size,
        sizePrice: item.price,
        crust: item.crust,
        extraToppings: item.extraToppings.map(t => ({ name: t, price: 2.00 })),
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
        image: '/src/assets/images/pizza_margherita_classic_1791819140145.jpg'
      });
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-[#E8DFD0] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD0] flex items-center justify-between bg-[#FAF7F2] shrink-0">
          <div>
            <h2 className="text-xl font-serif-title font-bold text-[#1F1D1D]">My Order History</h2>
            <p className="text-xs text-[#78716C] mt-0.5">Track active deliveries and reorder your past favorites</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:text-[#1F1D1D] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 flex-grow overflow-y-auto">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <RefreshCw className="w-6 h-6 animate-spin text-[#C82D2D] mb-2" />
              <p className="text-xs text-[#78716C]">Retrieving your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-[#D6C7B2] mx-auto" />
              <h3 className="text-sm font-bold text-[#1F1D1D]">No Orders Placed Yet</h3>
              <p className="text-xs text-[#78716C] max-w-xs mx-auto">
                Once you order from our wood-fired menu, you'll be able to view receipts and track live deliveries here.
              </p>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id || order.orderNumber}
                className="p-4 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] hover:border-[#D6C7B2] transition-colors space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFE5D5] pb-2.5">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#1F1D1D]">{order.orderNumber}</span>
                    <span className="text-[11px] text-[#78716C] block">
                      {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                      order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-[#1F1D1D] tabular-nums">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="text-xs text-[#57534E] space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.quantity}x {item.name} ({item.size})</span>
                      <span className="tabular-nums">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EFE5D5]">
                  <button
                    onClick={() => {
                      onClose();
                      onTrackOrder(order);
                    }}
                    className="py-1.5 px-3 text-xs font-semibold text-[#C82D2D] bg-white border border-[#E8DFD0] hover:border-[#C82D2D] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Track Live</span>
                  </button>
                  <button
                    onClick={() => handleReorder(order)}
                    className="py-1.5 px-3 text-xs font-semibold text-white bg-[#C82D2D] hover:bg-[#B32424] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
