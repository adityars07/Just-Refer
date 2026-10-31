import { Router } from 'express';
import { z } from 'zod';
import { RangeKey } from '../../../shared/types.js';
import { referralRepo } from '../repo/referralRepo.js';

export const dashboardRouter = Router();

const summaryQuerySchema = z.object({
  range: z.enum(['1W', '1M', '3M', '6M', 'FY', 'ALL']).optional().default('ALL'),
});

dashboardRouter.get('/dashboard/summary', async (req, res, next) => {
  try {
    const { range } = summaryQuerySchema.parse(req.query);
    const summary = await referralRepo.getDashboardSummary(range as RangeKey);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});
