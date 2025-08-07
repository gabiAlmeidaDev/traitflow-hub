// src/components/AppRoutes.tsx - NOVO ARQUIVO
import { Routes, Route } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AppLayout } from "./layout/AppLayout";

// Pages
import Dashboard from "../pages/Dashboard";
import Testes from "../pages/Testes";
import Candidatos from "../pages/Candidatos";
import Batches from "../pages/Batches";
import Relatorios from "../pages/Relatorios";
import Configuracoes from "../pages/Configuracoes";
import NotFound from "../pages/NotFound";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import TestePage from "../pages/TestePage";
import AdminDashboard from "../pages/admin/Dashboard";

export function AppRoutes() {
  const { loading, isAuthenticated } = useAuth();

  console.log('🔄 AppRoutes - Estado auth:', { loading, isAuthenticated });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando TalentAlign...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/teste/:linkUnico" element={<TestePage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="testes" element={<Testes />} />
        <Route path="candidatos" element={<Candidatos />} />
        <Route path="batches" element={<Batches />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="super_admin">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
