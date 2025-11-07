import { useState, useEffect, useCallback } from 'react';
import { AddProductForm } from '@/components/admin/AddProductForm';
import { ProductDataTable } from '@/components/admin/ProductDataTable';
import { EditProductDialog } from '@/components/admin/EditProductDialog';
import { DeleteProductAlert } from '@/components/admin/DeleteProductAlert';
import { BulkUploadCard } from '@/components/admin/BulkUploadCard';
import { Toaster, toast } from '@/components/ui/sonner';
import { api } from '@/lib/api-client';
import type { Product } from '@shared/types';
export function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api<Product[]>('/api/products');
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
    setProducts((prevProducts) =>
      [...prevProducts, newProduct].sort((a, b) => (a.name > b.name ? 1 : -1))
    );
  };
  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)).sort((a, b) => (a.name > b.name ? 1 : -1))
    );
  };
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api(`/api/products/${productToDelete.id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast.success(`Product "${productToDelete.name}" deleted successfully.`);
    } catch (err) {
      toast.error('Failed to delete product.');
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };
  const handleBulkUploadComplete = () => {
    fetchProducts();
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