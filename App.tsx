import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import RiderSignup from './pages/auth/RiderSignup';
import DriverSignup from './pages/auth/DriverSignup';
import RiderHome from './pages/rider/RiderHome';
import DriverDashboard from './pages/driver/DriverDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import { BackendProvider, useBackend } from './context/MockBackendContext';
import { UserRole } from './types';

const ProtectedRoute = ({ children, role }: { children: React.ReactElement, role: UserRole }) => {
  const { user } = useBackend();
  if (!user || user.role !== role) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup/rider" element={<RiderSignup />} />
      <Route path="/signup/driver" element={<DriverSignup />} />
      
      <Route path="/rider" element={
        <ProtectedRoute role={UserRole.RIDER}>
          <RiderHome />
        </ProtectedRoute>
      } />
      <Route path="/driver" element={
        <ProtectedRoute role={UserRole.DRIVER}>
          <DriverDashboard />
        </ProtectedRoute>
      } />
       <Route path="/admin" element={
        <ProtectedRoute role={UserRole.ADMIN}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <BackendProvider>
        <AppRoutes />
      </BackendProvider>
    </HashRouter>
  );
};

export default App;