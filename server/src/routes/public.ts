import { Router } from 'express';
import { SEED_PRODUCTS, SEED_PUBLIC_TESTIMONIALS } from '../data/seed.js';
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

      // Collect unique lenders from products
      const lenderSet = new Set<string>();
      SEED_PRODUCTS.forEach(p => p.lenders.forEach(l => lenderSet.add(l)));

      return {
        totalDisbursed: totalDisbursed > 0 ? totalDisbursed : 157000000, // ₹15.70 Cr
        payoutDisbursedPct: 100,
        lendingPartners: 40,
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
    business: '#B9C9F5',
    personal: '#BFE5C8',
  };
  const products = SEED_PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    minAmountLabel: p.minAmountLabel,
    startingRatePct: p.startingRatePct,
    payoutPct: p.payoutPct,
    examplePayoutLabel: p.examplePayoutLabel,
    iconColor: colorMap[p.id] || '#F4B942',
  }));
  res.json(products);
});

publicRouter.get('/public/lenders', (_req, res) => {
  const lenders = [
    { name: 'HDFC BANK', shortName: 'HDFC' },
    { name: 'ICICI BANK', shortName: 'ICICI' },
    { name: 'AXIS BANK', shortName: 'AXIS' },
    { name: 'IIFL Finance', shortName: 'IIFL' },
    { name: 'Bajaj Finserv', shortName: 'BAJAJ' },
    { name: 'Tata Capital', shortName: 'TATA' },
  ];
  res.json(lenders);
});

publicRouter.get('/public/testimonials', (_req, res) => {
  const approved = SEED_PUBLIC_TESTIMONIALS.filter(t => t.approved);
  res.json(approved);
});
