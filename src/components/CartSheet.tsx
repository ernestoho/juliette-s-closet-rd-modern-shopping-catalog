import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SheetHeader, SheetTitle, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { useCartStore } from '@/hooks/useCartStore';
import { Toaster, toast } from '@/components/ui/sonner';
const WHATSAPP_NUMBER = '+18296508431';
export function CartSheet() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const [location, setLocation] = useState('');
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handleOrder = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!location.trim()) {
      toast.error("Please enter your location.");
      return;
    }
    let message = "Hello Juliette's Closet! I would like to place an order:\n\n";
    items.forEach(item => {
      message += `*${item.name}*\n`;
      message += `_Quantity_: ${item.quantity}\n`;
      message += `_Price_: $${item.price.toFixed(2)}\n`;
      message += `_Image_: ${item.imageUrl}\n\n`;
    });
    message += `*Subtotal*: $${subtotal.toFixed(2)}\n`;
    message += `*Location*: ${location.trim()}\n\n`;
    message += "Please confirm my order. Thank you!";
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Redirecting to WhatsApp to complete your order!");
  };
  return (
    <>
      <SheetHeader className="px-6 pt-6 pb-4">
        <SheetTitle className="text-2xl font-display">Shopping Cart</SheetTitle>
        <SheetDescription>Review your items and proceed to order via WhatsApp.</SheetDescription>
      </SheetHeader>
      <Separator />
      {items.length > 0 ? (
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-grow px-6 py-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-24 object-cover rounded-md" />
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-sm">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          <SheetFooter className="p-6 bg-background border-t">
            <div className="w-full space-y-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Your Location</Label>
                <Input 
                  id="location" 
                  placeholder="e.g., Santo Domingo, Ensanche Naco" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button className="w-full text-lg py-6" onClick={handleOrder}>
                Order on WhatsApp
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </SheetFooter>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Your cart is empty</h3>
          <p className="text-muted-foreground mt-2">Add some products to get started!</p>
        </div>
      )}
      <Toaster richColors closeButton />
    </>
  );
}