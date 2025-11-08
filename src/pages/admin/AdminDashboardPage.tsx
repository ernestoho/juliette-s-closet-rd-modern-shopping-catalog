import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddProductForm } from '@/components/admin/Add-product-form';
import { ProductDataTable } from '@/components/admin/ProductDataTable';
import { EditProductDialog } from '@/components/admin/EditProductDialog';
import { DeleteProductAlert } from '@/components/admin/DeleteProductAlert';
import { BulkUploadCard } from '@/components/admin/BulkUploadCard';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from '@/components/ui/sonner';
import { api } from '@/lib/api-client';
import { emitter } from '@/lib/events';
import { useAuthStore } from '@/hooks/useAuthStore';
import type { Product } from '@shared/types';
import { LogOut } from 'lucide-react';
export function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<Product[]>('/api/products');
      setProducts(data.sort((a, b) => (a.name > b.name ? 1 : -1)));
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
    setProducts((prev) => [...prev, newProduct].sort((a, b) => (a.name > b.name ? 1 : -1)));
    emitter.emit('product-change');
  };
  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev
        .map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        .sort((a, b) => (a.name > b.name ? 1 : -1)),
    );
    setIsEditDialogOpen(false);
    emitter.emit('product-change');
  };
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/api/products/${productToDelete.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast.success(`Product "${productToDelete.name}" deleted successfully.`);
      emitter.emit('product-change');
    } catch (err) {
      toast.error('Failed to delete product.');
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };
  const handleBulkUploadComplete = () => {
    fetchProducts();
    emitter.emit('product-change');
  };
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/admin/login');
  };
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your products for Juliette's Closet RD.</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <ProductDataTable
                products={products}
                isLoading={isLoading}
                error={error}
                onEdit={(product) => {
                  setProductToEdit(product);
                  setIsEditDialogOpen(true);
                }}
                onDelete={(product) => {
                  setProductToDelete(product);
                  setIsDeleteDialogOpen(true);
                }}
              />
            </div>
            <div className="lg:col-span-1 space-y-8">
              <AddProductForm onProductActionComplete={handleProductAdded} />
              <BulkUploadCard onUploadComplete={handleBulkUploadComplete} />
            </div>
          </div>
        </div>
      </div>
      <EditProductDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        product={productToEdit}
        onProductUpdated={handleProductUpdated}
      />
      <DeleteProductAlert
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        product={productToDelete}
        onConfirm={handleConfirmDelete}
      />
      <Toaster richColors closeButton />
    </div>
  );
}