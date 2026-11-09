import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { adminRepo } from '../repo/adminRepo.js';
import { referralRepo } from '../repo/referralRepo.js';
import { withdrawalRepo } from '../repo/withdrawalRepo.js';
import { requireUser } from '../middleware/requireUser.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { WithdrawalStatus } from '../../../shared/types.js';

export const adminRouter = Router();

// Apply auth to all admin routes
adminRouter.use(requireUser);
adminRouter.use(requireAdmin);

// GET /api/admin/summary
adminRouter.get('/admin/summary', async (_req: Request, res: Response) => {
  try {
    const summary = await adminRepo.getSummary();
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({
      error: {
        code: 'server_error',
        message: err.message || 'Failed to fetch admin summary',
      },
    });
  }
});

// GET /api/admin/referrals
const referralsQuerySchema = z.object({
  status: z.enum(['all', 'in_login', 'underwriting', 'sanctioned', 'disbursed', 'rejected']).default('all'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(6),
});

adminRouter.get('/admin/referrals', async (req: Request, res: Response) => {
  const result = referralsQuerySchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      error: {
        code: 'bad_request',
        message: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      },
    });
  }

  try {
    const { status, page, pageSize } = result.data;
    const data = await adminRepo.getReferrals({ status, page, pageSize });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({
      error: {
        code: 'server_error',
        message: err.message || 'Failed to fetch admin referrals',
      },
    });
  }
});

// GET /api/admin/payout-run/next
adminRouter.get('/admin/payout-run/next', async (_req: Request, res: Response) => {
  try {
    const nextRun = await adminRepo.getNextPayoutRun();
    res.json(nextRun);
  } catch (err: any) {
    res.status(500).json({
      error: {
        code: 'server_error',
        message: err.message || 'Failed to fetch next payout run',
      },
    });
  }
});

// GET /api/admin/attention
adminRouter.get('/admin/attention', async (_req: Request, res: Response) => {
  try {
    const items = await adminRepo.getAttentionItems();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({
      error: {
        code: 'server_error',
        message: err.message || 'Failed to fetch attention items',
      },
    });
  }
});

// PATCH /api/admin/referrals/:id/status
const updateStatusSchema = z.object({
  stage: z.enum(['in_login', 'underwriting', 'sanctioned', 'disbursed', 'rejected']),
  amount: z.number().positive().optional(),
  date: z.string().optional(),
  reason: z.string().optional(),
  note: z.string().optional(),
});

adminRouter.patch('/admin/referrals/:id/status', async (req: Request, res: Response) => {
  const parseResult = updateStatusSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: {
        code: 'bad_request',
        message: parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      },
    });
  }

  const { id } = req.params;
  const adminName = req.user?.name || 'Admin';

  try {
    const updated = await referralRepo.updateReferralStatus(id, {
      ...parseResult.data,
      admin: adminName,
    });
    res.json({ success: true, referral: updated });
  } catch (err: any) {
    const isNotFound = err.message && err.message.includes('not found');
    res.status(isNotFound ? 404 : 400).json({
      error: {
        code: isNotFound ? 'not_found' : 'invalid_transition',
        message: err.message || 'Failed to update referral status',
      },
    });
  }
});

// POST /api/admin/referrals/:id/payout
const payoutSchema = z.object({
  amount: z.number().positive(),
  paidAt: z.string().min(1),
  reference: z.string().min(1),
});

adminRouter.post('/admin/referrals/:id/payout', async (req: Request, res: Response) => {
  const parseResult = payoutSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: {
        code: 'bad_request',
        message: parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      },
    });
  }

  const { id } = req.params;
  const adminName = req.user?.name || 'Admin';

  try {
    const updated = await referralRepo.recordReferralPayout(id, {
      ...parseResult.data,
      admin: adminName,
    });
    res.json({ success: true, referral: updated });
  } catch (err: any) {
    const isNotFound = err.message && err.message.includes('not found');
    res.status(isNotFound ? 404 : 400).json({
      error: {
        code: isNotFound ? 'not_found' : 'invalid_payout',
        message: err.message || 'Failed to record payout',
      },
    });
  }
});

// DELETE /api/admin/referrals/:id
adminRouter.delete('/admin/referrals/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await referralRepo.delete(id);
    if (!deleted) {
      return res.status(404).json({
        error: {
          code: 'not_found',
          message: 'Referral not found',
        },
      });
    }
    res.json({ success: true, message: 'Referral deleted successfully' });
  } catch (err: any) {
    res.status(500).json({
      error: {
        code: 'server_error',
        message: err.message || 'Failed to delete referral',
      },
    });
  }
});


// GET /api/admin/withdrawals
adminRouter.get('/admin/withdrawals', async (_req: Request, res: Response) => {
  try {
    const withdrawals = await withdrawalRepo.getAllWithdrawals();
    res.json({ withdrawals });
  } catch (err: any) {
    res.status(500).json({
      error: {
        code: 'server_error',
        message: err.message || 'Failed to fetch withdrawals',
      },
    });
  }
});

// PATCH /api/admin/withdrawals/:id/status
const withdrawalStatusSchema = z.object({
  status: z.enum(['processing', 'paid', 'rejected']),
  utr: z.string().optional(),
  paidAt: z.string().optional(),
  rejectReason: z.string().optional(),
});

adminRouter.patch('/admin/withdrawals/:id/status', async (req: Request, res: Response) => {
  const parseResult = withdrawalStatusSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: {
        code: 'bad_request',
        message: parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      },
    });
  }

  const { id } = req.params;
  const adminName = req.user?.name || 'Admin';
  const { status, utr, rejectReason } = parseResult.data;

  if (status === 'paid' && !utr) {
    return res.status(400).json({
      error: { code: 'bad_request', message: 'UTR is required when marking as paid' },
    });
  }
  if (status === 'rejected' && !rejectReason) {
    return res.status(400).json({
      error: { code: 'bad_request', message: 'Rejection reason is required' },
    });
  }

  try {
    const updated = await withdrawalRepo.updateWithdrawalStatus(
      id,
      status as WithdrawalStatus,
      { utr, rejectReason, admin: adminName }
    );
    res.json({ success: true, withdrawal: updated });
  } catch (err: any) {
    const isNotFound = err.message?.includes('not found');
    res.status(isNotFound ? 404 : 400).json({
      error: {
        code: isNotFound ? 'not_found' : 'invalid_status',
        message: err.message || 'Failed to update withdrawal status',
      },
    });
  }
});
