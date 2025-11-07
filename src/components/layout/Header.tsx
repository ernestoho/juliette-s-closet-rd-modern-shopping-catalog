import { ShoppingBag, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/hooks/useCartStore';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartSheet } from '@/components/CartSheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
const categories = ['Clothing', 'Home', 'Supplements', 'Amazon Various Items'];
export function Header() {
  const items = useCartStore((state) => state.items);
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const navLinks = (
    <>
      {categories.map((category) => (
        <a
          key={category}
          href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          {category}
        </a>
      ))}
    </>
  );
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="font-bold text-lg font-display">Juliette's Closet RD</span>
          </a>
          <nav className="hidden md:flex items-center space-x-6">{navLinks}</nav>
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <CartSheet />
              </SheetContent>
            </Sheet>
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="flex flex-col space-y-4 p-4">
                    <a href="#" className="font-bold text-lg font-display mb-4" onClick={() => setMobileMenuOpen(false)}>
                      Juliette's Closet RD
                    </a>
                    {navLinks}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}