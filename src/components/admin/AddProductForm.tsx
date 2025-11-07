import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Product, ProductCategory } from '@shared/types';
import { useEffect } from 'react';
const categories: ProductCategory[] = ['Clothing', 'Home', 'Supplements', 'Amazon Various Items'];
const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Must be a valid URL'),
  category: z.enum(categories),
});
export type ProductFormData = z.infer<typeof productSchema>;
interface AddProductFormProps {
  productToEdit?: Product | null;
  onProductActionComplete: (product: Product) => void;
}
export function AddProductForm({ productToEdit, onProductActionComplete }: AddProductFormProps) {
  const isEditMode = !!productToEdit;
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: productToEdit || {
      name: '',
      price: 0,
      description: '',
      imageUrl: '',
      category: 'Clothing',
    },
  });
  useEffect(() => {
    if (productToEdit) {
      form.reset(productToEdit);
    } else {
      form.reset({
        name: '',
        price: 0,
        description: '',
        imageUrl: '',
        category: 'Clothing',
      });
    }
  }, [productToEdit, form]);
  const onSubmit = async (data: ProductFormData) => {
    try {
      let resultProduct: Product;
      if (isEditMode && productToEdit) {
        resultProduct = await api<Product>(`/api/products/${productToEdit.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast.success('Product updated successfully!');
      } else {
        resultProduct = await api<Product>('/api/products', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast.success('Product added successfully!');
        form.reset();
      }
      onProductActionComplete(resultProduct);
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} product. Please try again.`);
      console.error(error);
    }
  };
  const cardContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Chic Summer Dress" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 75.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A light and airy dress..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://images.unsplash.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? isEditMode
              ? 'Saving...'
              : 'Adding...'
            : isEditMode
            ? 'Save Changes'
            : 'Add Product'}
        </Button>
      </form>
    </Form>
  );
  if (isEditMode) {
    return cardContent;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>{cardContent}</CardContent>
    </Card>
  );
}