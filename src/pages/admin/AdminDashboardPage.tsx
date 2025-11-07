import { useState, useEffect, useCallback } from 'react';
import { AddProductForm } from '@/components/admin/AddProductForm';
import { ProductDataTable } from '@/components/admin/ProductDataTable';
import { Toaster } from '@/components/ui/sonner';
import { api } from '@/lib/api-client';
import type { Product } from '@shared/types';
export function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api<Product[]>('/api/products');
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const handleProductAdded = (newProduct: Product) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
  };
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your products for Juliette's Closet RD.</p>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <ProductDataTable products={products} isLoading={isLoading} error={error} />
            </div>
            <div className="lg:col-span-1">
              <AddProductForm onProductAdded={handleProductAdded} />
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}