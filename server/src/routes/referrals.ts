import { Router } from 'express';
import { z } from 'zod';
import { LoanProductId } from '../../../shared/types.js';
import { referralRepo } from '../repo/referralRepo.js';
import { MIN_LOAN_AMOUNTS } from '../services/commission.js';

export const referralsRouter = Router();

const getReferralsQuerySchema = z.object({
  status: z.string().optional(),
  range: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(20),
});

const createReferralBodySchema = z.object({
  applicant: z.string().min(2, 'Applicant name must have at least 2 characters').max(80, 'Applicant name cannot exceed 80 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  city: z.string().min(2, 'City is required'),
  productId: z.enum(['home', 'lap', 'personal', 'business'] as const),
  loanAmount: z.number().positive('Loan amount must be greater than 0'),
}).refine(data => {
  const minRequired = MIN_LOAN_AMOUNTS[data.productId];
  return data.loanAmount >= minRequired;
}, data => ({
  message: `Loan amount for ${data.productId} must be at least ₹${MIN_LOAN_AMOUNTS[data.productId].toLocaleString('en-IN')}`,
  path: ['loanAmount'],
}));

referralsRouter.get('/referrals', async (req, res, next) => {
  try {
    const query = getReferralsQuerySchema.parse(req.query);
    const result = await referralRepo.getAll({
      status: query.status,
      range: query.range,
      page: query.page,
      pageSize: query.pageSize,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

referralsRouter.post('/referrals', async (req, res, next) => {
  try {
    const body = createReferralBodySchema.parse(req.body);
    const referral = await referralRepo.create({
      applicant: body.applicant.trim(),
      phone: body.phone.trim(),
      city: body.city.trim(),
      productId: body.productId as LoanProductId,
      loanAmount: body.loanAmount,
    });
    res.status(201).json(referral);
  } catch (err) {
    next(err);
  }
});
