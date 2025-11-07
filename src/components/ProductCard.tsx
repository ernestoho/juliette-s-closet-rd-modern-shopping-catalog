import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/hooks/useCartStore';
import type { Product } from '@shared/types';
import { Toaster, toast } from '@/components/ui/sonner';
interface ProductCardProps {
  product: Product;
}
export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="h-full"
      >
        <Card className="h-full flex flex-col overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 group">
          <CardHeader className="p-0 border-b">
            <div className="overflow-hidden aspect-[4/5] relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg font-medium leading-tight mb-1">{product.name}</CardTitle>
            <p className="text-primary font-semibold text-xl">${product.price.toFixed(2)}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              className="w-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
              variant="outline"
              onClick={handleAddToCart}
            >
              <Plus className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      <Toaster richColors closeButton />
    </>
  );
}