import { Router } from 'express';
import { SEED_FAQS } from '../data/seed.js';

export const faqsRouter = Router();

faqsRouter.get('/faqs', (_req, res) => {
  res.json(SEED_FAQS);
});
