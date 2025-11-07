import { useAuthStore } from '@/hooks/useAuthStore';
import { Navigate, Outlet } from 'react-router-dom';
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}