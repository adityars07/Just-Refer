import { Router } from 'express';
import { requireUser } from '../middleware/requireUser.js';

export const meRouter = Router();

meRouter.get('/me', requireUser, (req, res) => {
  res.json(req.user);
});
