import { Hono } from "hono";
import type { Env } from './core-utils';
import { ProductEntity } from "./entities";
import { ok, bad, isStr, notFound } from './core-utils';
import type { Product } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure mock products are seeded into the Durable Object on first request
  app.use('/api/products/*', async (c, next) => {
    await ProductEntity.ensureSeed(c.env);
    await next();
  });
  // GET all products
  app.get('/api/products', async (c) => {
    const page = await ProductEntity.list(c.env);
    return ok(c, page.items);
  });
  // POST a new product
  app.post('/api/products', async (c) => {
    const { name, price, description, imageUrl, category } = (await c.req.json()) as Partial<Product>;
    if (!isStr(name) || !isStr(description) || !isStr(imageUrl) || !isStr(category)) {
      return bad(c, 'Missing required string fields.');
    }
    if (typeof price !== 'number' || price <= 0) {
      return bad(c, 'Price must be a positive number.');
    }
    const newProduct: Product = {
      id: `prod_${crypto.randomUUID()}`,
      name,
      price,
      description,
      imageUrl,
      category,
    };
    const created = await ProductEntity.create(c.env, newProduct);
    return ok(c, created);
  });
  // PUT (update) an existing product
  app.put('/api/products/:id', async (c) => {
    const { id } = c.req.param();
    const productEntity = new ProductEntity(c.env, id);
    if (!(await productEntity.exists())) {
      return notFound(c, 'Product not found');
    }
    const { name, price, description, imageUrl, category } = (await c.req.json()) as Partial<Product>;
    if (!isStr(name) || !isStr(description) || !isStr(imageUrl) || !isStr(category)) {
      return bad(c, 'Missing required string fields.');
    }
    if (typeof price !== 'number' || price <= 0) {
      return bad(c, 'Price must be a positive number.');
    }
    const updatedProductData: Product = {
      id,
      name,
      price,
      description,
      imageUrl,
      category,
    };
    await productEntity.save(updatedProductData);
    return ok(c, updatedProductData);
  });
  // DELETE a product
  app.delete('/api/products/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await ProductEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Product not found or already deleted');
    }
    return ok(c, { id, deleted: true });
  });
}