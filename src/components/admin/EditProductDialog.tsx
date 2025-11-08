import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AddProductForm } from './Add-product-form';
import type { Product } from '@shared/types';
interface EditProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: (updatedProduct: Product) => void;
}
export function EditProductDialog({ product, isOpen, onClose, onProductUpdated }: EditProductDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Make changes to your product here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <AddProductForm
            productToEdit={product}
            onProductActionComplete={(updatedProduct) => {
              onProductUpdated(updatedProduct);
              onClose();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}