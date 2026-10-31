import { Router } from 'express';
import { SEED_SETTLEMENT } from '../data/seed.js';

export const settlementsRouter = Router();

settlementsRouter.get('/settlements/latest', (_req, res) => {
  res.json(SEED_SETTLEMENT);
});
