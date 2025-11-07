import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import { MOCK_PRODUCTS } from '@shared/mock-data';
import type { Product, ProductCategory } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
const categories: ProductCategory[] = ['Clothing', 'Home', 'Supplements', 'Amazon Various Items'];
export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return MOCK_PRODUCTS;
    }
    return MOCK_PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);
  const productsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = MOCK_PRODUCTS.filter(p => p.category === category);
      return acc;
    }, {} as Record<ProductCategory, Product[]>);
  }, []);
  const handleCategoryChange = (category: string) => {
    const element = document.getElementById(category.toLowerCase().replace(/\s+/g, '-'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
              <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="mb-20">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 border-l-4 border-primary pl-4">
                  {category}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                  {productsByCategory[category].map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Toaster richColors closeButton />
    </AppLayout>
  );
}