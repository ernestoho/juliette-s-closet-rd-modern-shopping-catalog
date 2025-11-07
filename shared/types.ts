export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type ProductCategory = 'Clothing' | 'Home' | 'Supplements' | 'Amazon Various Items';
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: ProductCategory;
}
export interface CartItem extends Product {
  quantity: number;
}