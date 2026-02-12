import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout';
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/routes';

// Public Pages
import Home from './pages/Home';
import PublicServices from './pages/public/PublicServices';
import PlatformServices from './pages/public/PlatformServices';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';
import RefundPolicy from './pages/public/RefundPolicy';
import Contact from './pages/public/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import Dashboard from './pages/user/Dashboard';
import NewOrder from './pages/user/NewOrder';
import Orders from './pages/user/Orders';
import Services from './pages/user/Services';
import AddFunds from './pages/user/AddFunds';
import Profile from './pages/user/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminAddFunds from './pages/admin/AdminAddFunds';

function App() {
  return (
    <Routes>
      {/* Home Page - Always accessible */}
      <Route path="/" element={<Home />} />
      
      {/* Public Services Pages */}
      <Route path="/services" element={<PublicServices />} />
      <Route path="/services/:platform" element={<PlatformServices />} />
      
      {/* Legal Pages */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/contact" element={<Contact />} />

      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-order" element={<NewOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/my-services" element={<Services />} />
          <Route path="/add-funds" element={<AddFunds />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/add-funds" element={<AdminAddFunds />} />
        </Route>
      </Route>

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
