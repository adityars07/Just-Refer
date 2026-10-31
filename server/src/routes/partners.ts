import { Router } from 'express';
import { SEED_PARTNERS } from '../data/seed.js';

export const partnersRouter = Router();

partnersRouter.get('/partners', (_req, res) => {
  res.json(SEED_PARTNERS);
});
