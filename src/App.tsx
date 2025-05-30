import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import VisitorLog from './pages/VisitorLog';
import RegisterVisitor from './pages/RegisterVisitor';
import QRScanner from './pages/QRScanner';
import QRGenerator from './pages/QRGenerator';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Login from './components/dashboard/login';
import Signup from './components/dashboard/signup';
import CheckoutPage from './pages/CheckoutPage';
import PreRegistrationForm from './components/visitors/PreRegistrationForm';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          duration: 4000,
          style: {
            fontSize: '0.875rem',
            maxWidth: '350px',
            padding: '8px 16px',
          },
        }} />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pre-registration" element={<PreRegistrationForm />} />

          {/* Protected routes */}
          <Route element={<Layout><ProtectedRoute><Outlet /></ProtectedRoute></Layout>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/visitors" element={<VisitorLog />} />
            <Route path="/register" element={<RegisterVisitor />} />
            <Route path="/scan" element={<QRScanner />} />
            <Route path="/qr-generator" element={<QRGenerator />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>

          {/* Checkout route */}
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;