import { IndexedEntity } from "./core-utils";
import type { Product } from "@shared/types";
import { MOCK_PRODUCTS } from "@shared/mock-data";
export class ProductEntity extends IndexedEntity<Product> {
  static readonly entityName = "product";
  static readonly indexName = "products";
  static readonly initialState: Product = {
    id: "",
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    category: "Clothing",
  };
  static seedData = MOCK_PRODUCTS;
}