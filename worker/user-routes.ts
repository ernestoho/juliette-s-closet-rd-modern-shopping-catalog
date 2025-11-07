import { Hono } from "hono";
import type { Env } from './core-utils';
import { ProductEntity } from "./entities";
import { ok, bad, isStr, notFound } from './core-utils';
import type { Product, ProductCategory } from "@shared/types";
const VALID_CATEGORIES: ProductCategory[] = ['Clothing', 'Home', 'Supplements', 'Amazon Various Items'];
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
  // POST bulk upload products from CSV
  app.post('/api/products/bulk-upload', async (c) => {
    const formData = await c.req.formData();
    const file = formData.get('products-csv');
    if (!(file instanceof File)) {
      return bad(c, 'CSV file is required.');
    }
    const csvText = await file.text();
    const rows = csvText.split('\n').map(row => row.trim()).filter(row => row.length > 0);
    if (rows.length <= 1) {
      return bad(c, 'CSV file must contain a header and at least one product row.');
    }
    const header = rows[0].split(',').map(h => h.trim());
    const expectedHeader = ['name', 'price', 'description', 'imageUrl', 'category'];
    if (JSON.stringify(header) !== JSON.stringify(expectedHeader)) {
      return bad(c, `Invalid CSV header. Expected: ${expectedHeader.join(',')}`);
    }
    const productRows = rows.slice(1);
    const results = { created: 0, failed: 0, errors: [] as string[] };
    const newProducts: Product[] = [];
    productRows.forEach((row, index) => {
      const values = row.split(',');
      if (values.length !== expectedHeader.length) {
        results.failed++;
        results.errors.push(`Row ${index + 1}: Incorrect number of columns.`);
        return;
      }
      const name = values[0];
      const price = parseFloat(values[1]);
      const description = values[2];
      const imageUrl = values[3];
      const category = values[4] as ProductCategory;
      if (!isStr(name) || !isStr(description) || !isStr(imageUrl) || !isStr(category)) {
        results.failed++;
        results.errors.push(`Row ${index + 1}: All fields must be non-empty strings.`);
        return;
      }
      if (isNaN(price) || price <= 0) {
        results.failed++;
        results.errors.push(`Row ${index + 1}: Price must be a positive number.`);
        return;
      }
      if (!VALID_CATEGORIES.includes(category)) {
        results.failed++;
        results.errors.push(`Row ${index + 1}: Invalid category "${category}".`);
        return;
      }
      newProducts.push({
        id: `prod_${crypto.randomUUID()}`,
        name,
        price,
        description,
        imageUrl,
        category,
      });
    });
    if (newProducts.length > 0) {
      try {
        await Promise.all(newProducts.map(p => ProductEntity.create(c.env, p)));
        results.created = newProducts.length;
      } catch (error) {
        console.error("Bulk upload failed during DB operation:", error);
        return bad(c, "An error occurred while saving products.");
      }
    }
    return ok(c, results);
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