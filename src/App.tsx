import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { OurCraftSection } from './components/OurCraftSection.tsx';
import { Footer } from './components/Footer.tsx';
import { PizzaDetailModal } from './components/PizzaDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderTrackingModal } from './components/OrderTrackingModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CustomerOrdersModal } from './components/CustomerOrdersModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { MongoSetupModal } from './components/MongoSetupModal.tsx';
import { Pizza, Order } from './types.ts';

const AppContent: React.FC = () => {
  const { addItem } = useCart();
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loadingPizzas, setLoadingPizzas] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Modal states
  const [customizingPizza, setCustomizingPizza] = useState<Pizza | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCustomerOrdersOpen, setIsCustomerOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMongoSetupOpen, setIsMongoSetupOpen] = useState(false);

  const fetchPizzas = async () => {
    setLoadingPizzas(true);
    try {
      const res = await fetch('/api/pizzas');
      const data = await res.json();
      if (data.success && data.data) {
        setPizzas(data.data);
      }
    } catch (err) {
      console.error('Failed to load pizzas:', err);
    } finally {
      setLoadingPizzas(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  const handleQuickAdd = (pizza: Pizza) => {
    addItem({
      pizzaId: pizza.id || pizza._id || '',
      name: pizza.name,
      basePrice: pizza.price,
      size: 'classic',
      sizePrice: pizza.sizes?.classic || pizza.price,
      crust: 'Traditional Neapolitan',
      extraToppings: [],
      quantity: 1,
      image: pizza.image
    });
  };

  const handleOrderPlaced = (order: Order) => {
    setIsCheckoutOpen(false);
    setActiveTrackingOrder(order);
    setIsTrackingOpen(true);
  };

  const scrollToMenu = () => {
    setActiveSection('menu');
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1F1D1D] selection:bg-[#FDF0ED] selection:text-[#C82D2D]">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenTracking={() => {
          setActiveTrackingOrder(null);
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCustomerOrders={() => setIsCustomerOrdersOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <Hero
          onExploreMenu={scrollToMenu}
          onTrackOrder={() => setIsTrackingOpen(true)}
        />

        <MenuSection
          pizzas={pizzas}
          onSelectPizza={(pizza) => setCustomizingPizza(pizza)}
          onQuickAdd={handleQuickAdd}
          loading={loadingPizzas}
        />

        <OurCraftSection />
      </main>

      {/* Pizzeria Footer */}
      <Footer
        onOpenMongoSetup={() => setIsMongoSetupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
      />

      {/* Modals & Overlays */}
      <PizzaDetailModal
        pizza={customizingPizza}
        onClose={() => setCustomizingPizza(null)}
      />

      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onExploreMenu={scrollToMenu}
      />

      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {isTrackingOpen && (
        <OrderTrackingModal
          initialOrder={activeTrackingOrder}
          onClose={() => setIsTrackingOpen(false)}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
        />
      )}

      {isCustomerOrdersOpen && (
        <CustomerOrdersModal
          onClose={() => setIsCustomerOrdersOpen(false)}
          onTrackOrder={(order) => {
            setActiveTrackingOrder(order);
            setIsTrackingOpen(true);
          }}
        />
      )}

      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          onOpenMongoSetup={() => setIsMongoSetupOpen(true)}
          onRefreshMenu={fetchPizzas}
        />
      )}

      {isMongoSetupOpen && (
        <MongoSetupModal
          onClose={() => setIsMongoSetupOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
