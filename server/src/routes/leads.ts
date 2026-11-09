import { Router, Request, Response } from 'express';
import { referralRepo } from '../repo/referralRepo.js';
import { LoanProductId, ReferralStatus } from '../../../shared/types.js';
import { generateReferralCode } from '../../../shared/referralCode.js';

export const leadsRouter = Router();

const PRODUCT_NAME_MAP: Record<LoanProductId, string> = {
  home: 'Home Loan',
  lap: 'Loan Against Property',
  personal: 'Personal Loan',
  business: 'Business Loan',
};

const DEFAULT_LENDER_MAP: Record<LoanProductId, string> = {
  home: 'HDFC Bank',
  lap: 'Bajaj Finserv',
  personal: 'IDFC FIRST',
  business: 'IIFL Finance',
};

const STATUS_MAP_TO_UI: Record<ReferralStatus, string> = {
  in_login: 'Submitted',
  underwriting: 'In Review',
  sanctioned: 'Sanctioned',
  disbursed: 'Disbursed',
  rejected: 'Rejected',
};

const STATUS_MAP_FROM_UI: Record<string, ReferralStatus> = {
  submitted: 'in_login',
  'in login': 'in_login',
  in_login: 'in_login',
  'in review': 'underwriting',
  underwriting: 'underwriting',
  sanctioned: 'sanctioned',
  disbursed: 'disbursed',
  approved: 'disbursed',
  rejected: 'rejected',
};

function normalizeProduct(prod: any): LoanProductId {
  const p = String(prod || '').toLowerCase();
  if (p.includes('property') || p.includes('lap')) return 'lap';
  if (p.includes('personal')) return 'personal';
  if (p.includes('business')) return 'business';
  return 'home';
}

function formatLeadResponse(r: any) {
  const prodName = PRODUCT_NAME_MAP[r.productId as LoanProductId] || r.productId;
  const bank = r.lender || DEFAULT_LENDER_MAP[r.productId as LoanProductId] || 'HDFC Bank';
  const statusUi = STATUS_MAP_TO_UI[r.status as ReferralStatus] || 'Submitted';
  const partnerCode = r.partnerReferralCode || (r.partnerName ? generateReferralCode(r.partnerName) : 'JR-PARTNER');

  return {
    id: r.id,
    partner_id: r.partnerId || '00000000-0000-0000-0000-000000000001',
    applicant_name: r.applicant,
    applicant_phone: r.phone || '',
    applicant_city: r.city || 'Mumbai',
    loan_product: prodName,
    loan_amount: r.loanAmount,
    assigned_bank: bank,
    status: statusUi,
    commission_amount: r.commission,
    notes: r.notes || '',
    created_at: r.createdAt,
    partner_name: r.partnerName || 'Partner',
    partner_referral_code: partnerCode,
  };
}

// POST /api/leads (Fast Lead Intake)
leadsRouter.post(['/', '/leads'], async (req: Request, res: Response) => {
  try {
    const {
      applicantName,
      applicant,
      applicantPhone,
      phone,
      applicantCity,
      city,
      loanProduct,
      productId,
      loanAmount,
      partnerName,
      partnerReferralCode,
      referralCode,
      notes,
    } = req.body || {};

    const name = (applicantName || applicant || '').trim();
    const rawPhone = (applicantPhone || phone || '').trim();
    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
    const resolvedCity = (applicantCity || city || 'Mumbai').trim();
    const resolvedProd = normalizeProduct(loanProduct || productId);
    const numAmt = parseFloat(String(loanAmount).replace(/[^0-9.]/g, '')) || 0;

    if (!name || cleanPhone.length < 10 || numAmt <= 0) {
      return res.status(400).json({
        error: 'Applicant name, valid 10-digit phone, and positive loan amount are required',
      });
    }

    let resolvedPartnerName = partnerName || req.user?.name;
    let resolvedPartnerCode = partnerReferralCode || referralCode;
    if ((!resolvedPartnerName || !resolvedPartnerCode) && req.headers.authorization) {
      try {
        const raw = req.headers.authorization.replace(/^Bearer jr_/, '');
        const dec = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
        if (!resolvedPartnerName) resolvedPartnerName = dec.name || dec.full_name;
        if (!resolvedPartnerCode) resolvedPartnerCode = dec.referral_code || dec.referralCode;
      } catch {}
    }

    if (!resolvedPartnerCode && resolvedPartnerName) {
      resolvedPartnerCode = generateReferralCode(resolvedPartnerName);
    }

    const referral = await referralRepo.create({
      applicant: name,
      phone: cleanPhone,
      city: resolvedCity,
      productId: resolvedProd,
      loanAmount: numAmt,
      partnerName: resolvedPartnerName || 'Ayush Shrivastava',
      partnerReferralCode: resolvedPartnerCode,
    });

    const lead = formatLeadResponse(referral);

    return res.status(201).json({
      success: true,
      message: 'Referral submitted successfully! (Zero KYC needed)',
      lead,
    });
  } catch (err: any) {
    console.error('[LeadsRouter] create lead error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create lead' });
  }
});

// GET /api/leads/all & GET /api/leads
leadsRouter.get(['/', '/all', '/leads', '/leads/all'], async (_req: Request, res: Response) => {
  try {
    const all = await referralRepo.getAllReferrals();
    const leads = all.map(formatLeadResponse);
    return res.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to retrieve leads' });
  }
});

// GET /api/leads/partner/:partnerId
leadsRouter.get('/partner/:partnerId', async (_req: Request, res: Response) => {
  try {
    const all = await referralRepo.getAllReferrals();
    const leads = all.map(formatLeadResponse);
    return res.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to retrieve leads' });
  }
});

// PUT /api/leads/:id/status
leadsRouter.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, commissionAmount } = req.body || {};

    const targetStatus = STATUS_MAP_FROM_UI[String(status || '').toLowerCase()];
    if (!targetStatus) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: Submitted, In Review, Sanctioned, Disbursed, Rejected`,
      });
    }

    const updated = await referralRepo.updateStatus(id, targetStatus, commissionAmount);
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    return res.json({
      success: true,
      message: 'Lead status updated successfully',
      lead: formatLeadResponse(updated),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update lead status' });
  }
});

// DELETE /api/leads/:id
leadsRouter.delete(['/:id', '/leads/:id'], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await referralRepo.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    return res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to delete lead' });
  }
});


