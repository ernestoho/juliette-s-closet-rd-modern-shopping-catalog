import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { emitter } from '@/lib/events';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from '@/components/ui/sonner';
import { api } from '@/lib/api-client';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Frown } from 'lucide-react';
export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const fetchProducts = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setIsLoading(true);
      }
      const data = await api<Product[]>('/api/products');
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Could not load products. Please try again later.");
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  }, []);
  useEffect(() => {
    fetchProducts(true);
    const refreshProducts = () => fetchProducts(false);
    emitter.on('product-change', refreshProducts);
    return () => {
      emitter.off('product-change', refreshProducts);
    };
  }, [fetchProducts]);
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      return categoryMatch && priceMatch;
    });
  }, [products, selectedCategory, priceRange]);
  const renderProductGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={`skeleton-${i}`} className="space-y-2">
              <Skeleton className="aspect-[4/5] w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      );
    }
    if (filteredProducts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-16 col-span-full">
          <Frown className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No Products Found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredProducts.map(product => (
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
            <Button size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
              Shop Now
            </Button>
          </motion.div>
        </section>
        {/* Main Content */}
        <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="py-16 md:py-24">
            <header className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold">Our Catalog</h2>
              <p className="text-muted-foreground mt-2">Filter by category or price to find exactly what you're looking for.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <aside className="md:col-span-1">
                <FilterSidebar 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                />
              </aside>
              <section className="md:col-span-3">
                {renderProductGrid()}
              </section>
            </div>
          </div>
        </div>
      </main>
      <Toaster richColors closeButton />
    </AppLayout>
  );
}