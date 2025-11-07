import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product, ProductCategory } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from '@/components/ui/sonner';
import { api } from '@/lib/api-client';
const categories: ProductCategory[] = ['Clothing', 'Home', 'Supplements', 'Amazon Various Items'];
export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await api<Product[]>('/api/products');
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Could not load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const productsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = products.filter(p => p.category === category);
      return acc;
    }, {} as Record<ProductCategory, Product[]>);
  }, [products]);
  const handleCategoryChange = (category: string) => {
    const element = document.getElementById(category.toLowerCase().replace(/\s+/g, '-'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const renderProductGrid = (category: ProductCategory) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={`skeleton-${category}-${i}`} className="space-y-2">
              <Skeleton className="aspect-[4/5] w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      );
    }
    const categoryProducts = productsByCategory[category];
    if (categoryProducts.length === 0) {
      return <p className="text-muted-foreground">No products in this category yet.</p>;
    }
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {categoryProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };
  return (
    <AppLayout>
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white bg-black">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1287&auto=format&fit=crop"
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 p-4"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-balance">
              Modern Style, Delivered.
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-balance text-white/90">
              Discover curated collections of fashion, home goods, and more. Effortless shopping, right to your WhatsApp.
            </p>
            <Button size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6" onClick={() => handleCategoryChange('Clothing')}>
              Shop Now
            </Button>
          </motion.div>
        </section>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24">
            {categories.map(category => (
              <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="mb-20 scroll-mt-20">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 border-l-4 border-primary pl-4">
                  {category}
                </h2>
                {renderProductGrid(category)}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Toaster richColors closeButton />
    </AppLayout>
  );
}