import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HotelDataProvider } from './context/HotelDataContext';
import { CartProvider } from './context/CartContext';

// Marriott-Style Public Layout Components
import { MarriottNavbar } from './components/public/MarriottNavbar';
import { MarriottFooter } from './components/public/MarriottFooter';
import { DirectBookingModal } from './components/public/DirectBookingModal';

// Public Marketing Pages
import { HomePage } from './pages/public/HomePage';
import { RoomsPage } from './pages/public/RoomsPage';
import { RoomDetailPage } from './pages/public/RoomDetailPage';
import { ContactPage } from './pages/public/ContactPage';

// In-Room QR Service Digital Dining Pages
import { MenuPage } from './pages/guest/MenuPage';
import { CartPage } from './pages/guest/CartPage';
import { CheckoutPage } from './pages/guest/CheckoutPage';
import { PaymentPage } from './pages/guest/PaymentPage';
import { OrderStatusPage } from './pages/guest/OrderStatusPage';

// Kitchen Display System (KDS)
import { KitchenPage } from './pages/kitchen/KitchenPage';

// Admin Operations & Property Management Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminRoomsPage } from './pages/admin/AdminRoomsPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminGuestsPage } from './pages/admin/AdminGuestsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminMenuPage } from './pages/admin/AdminMenuPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminQRPage } from './pages/admin/AdminQRPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAuditPage } from './pages/admin/AdminAuditPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';

// Public Layout Wrapper
const PublicLayout: React.FC = () => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  return (
    <>
      <MarriottNavbar onOpenBookingModal={() => setBookingModalOpen(true)} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <MarriottFooter />
      <DirectBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </>
  );
};

// In-Room Dining Layout Wrapper
const GuestDiningLayout: React.FC = () => {
  return (
    <>
      <MarriottNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </>
  );
};

// Strict Protected Route Guard for Admin & Operations
const ProtectedAdminRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
};

// Strict Protected Route Guard for Kitchen KDS Screen
const ProtectedKitchenRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }
  return <KitchenPage />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HotelDataProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-[#0d0d0d]">
              <Routes>
                {/* 1. Public Marketing Hotel Website Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/rooms" element={<RoomsPage />} />
                  <Route path="/rooms/:slug" element={<RoomDetailPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                </Route>

                {/* 2. In-Room QR Code Dining Routes */}
                <Route element={<GuestDiningLayout />}>
                  <Route path="/order" element={<MenuPage />} />
                  <Route path="/order/cart" element={<CartPage />} />
                  <Route path="/order/checkout" element={<CheckoutPage />} />
                  <Route path="/order/payment" element={<PaymentPage />} />
                  <Route path="/order/status/:orderId" element={<OrderStatusPage />} />
                  <Route path="/order/status" element={<OrderStatusPage />} />
                </Route>

                {/* 3. Staff Authentication Gate */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/login" element={<AdminLoginPage />} />

                {/* 4. Protected Kitchen Display Screen (KDS) */}
                <Route path="/kitchen" element={<ProtectedKitchenRoute />} />

                {/* 5. Protected Operational Admin Dashboard */}
                <Route element={<ProtectedAdminRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="rooms" element={<AdminRoomsPage />} />
                    <Route path="bookings" element={<AdminBookingsPage />} />
                    <Route path="guests" element={<AdminGuestsPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="payments" element={<AdminPaymentsPage />} />
                    <Route path="menu" element={<AdminMenuPage />} />
                    <Route path="media" element={<AdminMediaPage />} />
                    <Route path="qr" element={<AdminQRPage />} />
                    <Route path="reports" element={<AdminReportsPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                    <Route path="audit" element={<AdminAuditPage />} />
                  </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </CartProvider>
        </HotelDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
