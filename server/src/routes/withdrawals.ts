import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireUser } from '../middleware/requireUser.js';
import { withdrawalRepo } from '../repo/withdrawalRepo.js';
import { lookupIFSC } from '../services/ifsc.js';

export const withdrawalsRouter = Router();

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

// Rate-limit tracker for POST /api/withdrawals (per partner)
const withdrawRateLimit = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 30_000; // 30 seconds

// GET /api/bank-account
withdrawalsRouter.get('/bank-account', requireUser, async (req: Request, res: Response) => {
  try {
    const partnerId = req.user?.phone || req.user?.name || 'unknown';
    const account = await withdrawalRepo.getBankAccount(partnerId);
    res.json(account);
  } catch (err: any) {
    res.status(500).json({ error: { code: 'server_error', message: err.message } });
  }
});

// PUT /api/bank-account
const bankAccountSchema = z.object({
  holderName: z.string().min(2).max(60).regex(/^[A-Za-z\s.'-]+$/, 'Holder name must be 2-60 letters'),
  accountNumber: z.string().regex(/^\d{9,18}$/, 'Account number must be 9-18 digits'),
  ifsc: z.string().regex(IFSC_REGEX, 'Invalid IFSC code format'),
});

withdrawalsRouter.put('/bank-account', requireUser, async (req: Request, res: Response) => {
  const result = bankAccountSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: {
        code: 'bad_request',
        message: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      },
    });
  }

  try {
    const partnerId = req.user?.phone || req.user?.name || 'unknown';
    const { holderName, accountNumber, ifsc } = result.data;

    // Lookup bank name from IFSC
    let bankName: string | undefined;
    const lookup = await lookupIFSC(ifsc);
    if (lookup.valid && lookup.bankName) {
      bankName = lookup.bankName;
    }

    const saved = await withdrawalRepo.saveBankAccount(partnerId, {
      holderName,
      accountNumber,
      ifsc: ifsc.toUpperCase(),
      bankName,
    });

    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: { code: 'server_error', message: err.message } });
  }
});

// GET /api/ifsc/:code (frontend IFSC lookup proxy)
withdrawalsRouter.get('/ifsc/:code', requireUser, async (req: Request, res: Response) => {
  const code = (req.params.code || '').trim().toUpperCase();
  if (!IFSC_REGEX.test(code)) {
    return res.status(400).json({ valid: false, message: 'Invalid IFSC format' });
  }
  try {
    const result = await lookupIFSC(code);
    res.json(result);
  } catch {
    res.json({ valid: false });
  }
});

// POST /api/withdrawals
const createWithdrawalSchema = z.object({
  amount: z.number().positive(),
  saveDetails: z.boolean().optional().default(true),
  holderName: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[A-Za-z\s.'-]+$/, 'Holder name must be 2-60 letters')
    .optional(),
  accountNumber: z
    .string()
    .regex(/^\d{9,18}$/, 'Account number must be 9-18 digits')
    .optional(),
  ifsc: z.string().regex(IFSC_REGEX, 'Invalid IFSC code format').optional(),
});

withdrawalsRouter.post('/withdrawals', requireUser, async (req: Request, res: Response) => {
  // Rate limit check
  const partnerId = req.user?.phone || req.user?.name || 'unknown';
  const now = Date.now();
  const lastRequest = withdrawRateLimit.get(partnerId);
  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW_MS) {
    return res.status(429).json({
      error: {
        code: 'rate_limited',
        message: 'Please wait before making another withdrawal request.',
      },
    });
  }

  const result = createWithdrawalSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: {
        code: 'bad_request',
        message: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      },
    });
  }

  try {
    const partnerName = req.user?.name || 'Partner';
    const withdrawal = await withdrawalRepo.createWithdrawal(partnerId, partnerName, result.data);
    withdrawRateLimit.set(partnerId, Date.now());
    res.json({ success: true, withdrawal });
  } catch (err: any) {
    const isValidation = err.message?.includes('Minimum') || err.message?.includes('Insufficient') || err.message?.includes('required');
    res.status(isValidation ? 400 : 500).json({
      error: {
        code: isValidation ? 'validation_error' : 'server_error',
        message: err.message || 'Failed to create withdrawal',
      },
    });
  }
});

// GET /api/withdrawals
withdrawalsRouter.get('/withdrawals', requireUser, async (req: Request, res: Response) => {
  try {
    const partnerId = req.user?.phone || req.user?.name || 'unknown';
    const withdrawals = await withdrawalRepo.getPartnerWithdrawals(partnerId);
    const available = await withdrawalRepo.getPartnerAvailableBalance(partnerId);
    res.json({ withdrawals, available });
  } catch (err: any) {
    res.status(500).json({ error: { code: 'server_error', message: err.message } });
  }
});

