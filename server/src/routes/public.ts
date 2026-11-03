import { Router } from 'express';
import { SEED_PRODUCTS } from '../data/seed.js';
import { referralRepo } from '../repo/referralRepo.js';

export const publicRouter = Router();

// Simple 5-minute in-memory cache
const cache = new Map<string, { data: any; expires: number }>();
function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expires) return Promise.resolve(entry.data as T);
  return fn().then(data => {
    cache.set(key, { data, expires: Date.now() + ttlMs });
    return data;
  });
}

const FIVE_MIN = 5 * 60 * 1000;

publicRouter.get('/public/stats', async (_req, res) => {
  try {
    const stats = await cached('public-stats', FIVE_MIN, async () => {
      const all = await referralRepo.getAllReferrals();
      const disbursed = all.filter(r => r.status === 'disbursed');
      const totalDisbursed = disbursed.reduce((s, r) => s + (r.disbursedAmount || r.loanAmount), 0);
      const totalCommission = disbursed.reduce((s, r) => s + r.commission, 0);

      // Collect unique lenders from products
      const lenderSet = new Set<string>();
      SEED_PRODUCTS.forEach(p => p.lenders.forEach(l => lenderSet.add(l)));

      return {
        totalDisbursed: totalDisbursed || undefined,
        payoutDisbursedPct: disbursed.length > 0 ? 100 : undefined,
        lendingPartners: lenderSet.size > 0 ? lenderSet.size : undefined,
        timeToRefer: '30 sec',
      };
    });
    res.json(stats);
  } catch (err) {
    res.json({});
  }
});

publicRouter.get('/public/products', (_req, res) => {
  const colorMap: Record<string, string> = {
    home: '#F4B942',
    lap: '#ECC6E4',
    personal: '#B9C9F5',
    business: '#BFE5C8',
  };
  const products = SEED_PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    minAmountLabel: p.minAmountLabel,
    startingRatePct: p.startingRatePct,
    payoutPct: p.payoutPct,
    examplePayoutLabel: p.examplePayoutLabel,
    iconColor: colorMap[p.id] || '#E6E4DE',
  }));
  res.json(products);
});

publicRouter.get('/public/lenders', (_req, res) => {
  const lenderSet = new Map<string, string>();
  SEED_PRODUCTS.forEach(p => {
    p.lenders.forEach(l => {
      if (!lenderSet.has(l)) {
        lenderSet.set(l, l.split(' ')[0].toUpperCase().slice(0, 4));
      }
    });
  });
  const lenders = Array.from(lenderSet.entries()).map(([name, shortName]) => ({
    name,
    shortName,
  }));
  res.json(lenders);
});

publicRouter.get('/public/testimonials', (_req, res) => {
  // Return empty array — only approved real testimonials
  // Admin can add testimonials with approved flag in future
  res.json([]);
});
