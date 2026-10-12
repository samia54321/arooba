import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, Clock, Flame, Bike, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { Order } from '../types.ts';

interface OrderTrackingModalProps {
  initialOrder: Order | null;
  onClose: () => void;
}

const ORDER_STEPS = [
  { key: 'pending', label: 'Order Confirmed', desc: 'Ticket printed in kitchen', icon: Clock },
  { key: 'preparing', label: 'Hand Stretched', desc: 'San Marzano sauce & toppings placed', icon: Flame },
  { key: 'baking', label: 'Wood-Fired Baking', desc: 'Blistering in 900°F stone oven', icon: Flame },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'In thermal insulated pizza carrier', icon: Bike },
  { key: 'delivered', label: 'Delivered Hot', desc: 'Enjoy authentic Neapolitan craft!', icon: PackageCheck }
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ initialOrder, onClose }) => {
  const [orderNumberInput, setOrderNumberInput] = useState(initialOrder?.orderNumber || '');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(initialOrder);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchOrder = async (numberToSearch: string) => {
    if (!numberToSearch.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/orders/${numberToSearch.trim()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentOrder(data.data);
      } else {
        setErrorMsg(data.error || 'Order not found. Please check your order code.');
      }
    } catch (err: any) {
      setErrorMsg('Failed to check order status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrder?.orderNumber) {
      fetchOrder(initialOrder.orderNumber);
    }
  }, [initialOrder]);

  // Periodic status poll if order is active
  useEffect(() => {
    if (!currentOrder || currentOrder.status === 'delivered' || currentOrder.status === 'cancelled') return;
    const interval = setInterval(() => {
      fetchOrder(currentOrder.orderNumber);
    }, 12000); // 12 seconds
    return () => clearInterval(interval);
  }, [currentOrder]);

  const getStepIndex = (status: Order['status']): number => {
    switch (status) {
      case 'pending': return 0;
      case 'preparing': return 1;
      case 'baking': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const activeIndex = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8DFD0] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD0] flex items-center justify-between bg-[#FAF7F2] shrink-0">
          <div>
            <h2 className="text-xl font-serif-title font-bold text-[#1F1D1D]">Live Order Tracker</h2>
            <p className="text-xs text-[#78716C] mt-0.5">Real-time oven & delivery telemetry</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close order tracker"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:text-[#1F1D1D] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-grow">
          {/* Search box for tracking any order */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrder(orderNumberInput);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-grow">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
              <input
                type="text"
                placeholder="Enter order code (e.g. VF-849124)"
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value.toUpperCase())}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8DFD0] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D] font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-4 bg-[#C82D2D] hover:bg-[#B32424] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Track</span>
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {currentOrder ? (
            <div className="space-y-6">
              {/* Top Banner with ETA */}
              <div className="bg-[#FAF7F2] border border-[#E8DFD0] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#78716C] uppercase font-semibold tracking-wider block">
                    Order Reference
                  </span>
                  <span className="text-base font-bold font-mono text-[#1F1D1D] tracking-tight">
                    {currentOrder.orderNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#78716C] uppercase font-semibold tracking-wider block">
                    {currentOrder.status === 'delivered' ? 'Status' : 'Estimated Time'}
                  </span>
                  <span className="text-base font-bold text-[#C82D2D] tabular-nums">
                    {currentOrder.status === 'delivered'
                      ? 'Delivered'
                      : currentOrder.estimatedDeliveryTime || '30-40 mins'}
                  </span>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider">
                  Preparation Milestones
                </p>
                <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E8DFD0]">
                  {ORDER_STEPS.map((step, idx) => {
                    const isDone = idx <= activeIndex && currentOrder.status !== 'cancelled';
                    const isCurrent = idx === activeIndex && currentOrder.status !== 'cancelled';
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="relative flex items-start gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                            isDone
                              ? isCurrent
                                ? 'bg-[#C82D2D] text-white ring-4 ring-red-100 shadow-xs'
                                : 'bg-[#16A34A] text-white'
                              : 'bg-white border-2 border-[#E8DFD0] text-[#A8A29E]'
                          }`}
                        >
                          {idx < activeIndex ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        <div className="pt-0.5">
                          <p className={`text-xs font-bold ${isCurrent ? 'text-[#C82D2D]' : isDone ? 'text-[#1F1D1D]' : 'text-[#A8A29E]'}`}>
                            {step.label}
                          </p>
                          <p className="text-[11px] text-[#78716C]">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Simulation Strip */}
              {currentOrder.status === 'out_for_delivery' && (
                <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C82D2D] text-white flex items-center justify-center shrink-0">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1F1D1D]">Courier En Route: Marco</p>
                    <p className="text-[11px] text-[#78716C]">
                      Your pizza is insulated inside our heated ceramic transport container.
                    </p>
                  </div>
                </div>
              )}

              {/* Order Items Breakdown */}
              <div className="border-t border-[#F5EFE6] pt-4 space-y-2">
                <p className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider mb-2">
                  Order Summary
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {currentOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs py-1 border-b border-[#FAF7F2]">
                      <div>
                        <span className="font-semibold text-[#1F1D1D]">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-[#78716C] block text-[11px]">
                          {item.size} · {item.crust}
                          {item.extraToppings?.length ? ` · +${item.extraToppings.join(', ')}` : ''}
                        </span>
                      </div>
                      <span className="font-bold tabular-nums text-[#1F1D1D]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-xs text-[#78716C] space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="tabular-nums">${currentOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="tabular-nums">
                      {currentOrder.deliveryFee === 0 ? 'FREE' : `$${currentOrder.deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#1F1D1D] pt-1 border-t border-[#E8DFD0]">
                    <span>Total Paid</span>
                    <span className="text-[#C82D2D] tabular-nums">${currentOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-2">
              <Clock className="w-10 h-10 text-[#D6C7B2] mx-auto" />
              <p className="text-xs font-semibold text-[#1F1D1D]">No Order Selected</p>
              <p className="text-[11px] text-[#78716C] max-w-xs mx-auto">
                Place an order through the cart or enter your order reference code above to follow its journey from the oven to your table.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
