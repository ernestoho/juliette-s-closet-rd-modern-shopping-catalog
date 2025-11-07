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
import type { Product, ProductCategory } from '@shared/types';
import { useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
const categories: ProductCategory[] = ['Clothing', 'Home', 'Supplements', 'Amazon Various Items'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(categories),
  imageUrl: z.string().url().optional(),
  imageFile: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
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
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      category: 'Clothing',
      imageUrl: '',
      imageFile: undefined,
    },
  });
  useEffect(() => {
    if (productToEdit) {
      form.reset({
        name: productToEdit.name,
        price: productToEdit.price,
        description: productToEdit.description,
        category: productToEdit.category,
        imageUrl: productToEdit.imageUrl,
        imageFile: undefined,
      });
    } else {
      form.reset({
        name: '',
        price: 0,
        description: '',
        category: 'Clothing',
        imageUrl: '',
        imageFile: undefined,
      });
    }
  }, [productToEdit, form.reset]);
  const onSubmit = async (data: ProductFormData) => {
    if (!isEditMode && !data.imageFile) {
      form.setError('imageFile', { type: 'manual', message: 'An image is required.' });
      return;
    }
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', String(data.price));
    formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.imageFile) {
      formData.append('imageFile', data.imageFile);
    }
    if (isEditMode && productToEdit?.imageUrl) {
      formData.append('imageUrl', productToEdit.imageUrl);
    }
    try {
      let resultProduct: Product;
      const url = isEditMode && productToEdit ? `/api/products/${productToEdit.id}` : '/api/products';
      const method = isEditMode ? 'PUT' : 'POST';
      const response = await fetch(url, { method, body: formData });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || `Failed to ${isEditMode ? 'update' : 'add'} product.`);
      }
      resultProduct = result.data;
      toast.success(`Product ${isEditMode ? 'updated' : 'added'} successfully!`);
      if (!isEditMode) {
        form.reset();
      }
      onProductActionComplete(resultProduct);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `An unknown error occurred.`);
      console.error(error);
    }
  };
  const cardContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="imageFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <ImageUploader
                  onFileChange={(file) => field.onChange(file)}
                  previewUrl={form.watch('imageUrl')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <Input type="number" step="0.01" placeholder="e.g., 75.00" {...field} />
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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