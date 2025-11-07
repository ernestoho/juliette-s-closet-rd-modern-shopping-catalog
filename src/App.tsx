import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
export function App() {
  useEffect(() => {
    // Set dark theme by default
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);
  return <RouterProvider router={router} />;
}