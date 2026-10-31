import { Router } from 'express';
import { SEED_PRODUCTS } from '../data/seed.js';

export const productsRouter = Router();

productsRouter.get('/products', (_req, res) => {
  res.json(SEED_PRODUCTS);
});
