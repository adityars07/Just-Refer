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

    // Extract partnerId if authenticated
    let partnerId: string | undefined;
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer jr_')) {
      try {
        const raw = authHeader.replace(/^Bearer jr_/, '');
        const decoded = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
        partnerId = decoded.phone || decoded.name;
      } catch {
        // ignore
      }
    }

    const summary = await referralRepo.getDashboardSummary(range as RangeKey, partnerId);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});
