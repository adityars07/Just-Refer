import express from 'express';
import cors from 'cors';
import { query } from '../shared/db.js';

const app = express();
const PORT = process.env.PRODUCT_SERVICE_PORT || 4004;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'product-service', status: 'healthy', port: PORT });
});

// Get Loan Products List
app.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM loan_products WHERE is_active = TRUE ORDER BY created_at ASC;`
    );

    return res.json({
      success: true,
      count: result.rows.length,
      products: result.rows
    });
  } catch (err) {
    console.error('[ProductService] Get products error:', err);
    return res.status(500).json({ error: 'Failed to retrieve loan products' });
  }
});

// Dynamic Commission Calculator Engine
app.post('/calculate', async (req, res) => {
  try {
    const { loanProduct = 'Home Loan', loanAmount = 2500000 } = req.body;
    const amount = parseFloat(loanAmount) || 0;

    let ratePercent = 0.3;
    let minAmount = 5000000;

    switch (loanProduct) {
      case 'Home Loan':
        ratePercent = 0.3;
        minAmount = 5000000; // 50 Lacs
        break;
      case 'Loan Against Property':
        ratePercent = 0.5;
        minAmount = 10000000; // 1 Cr
        break;
      case 'Personal Loan':
        ratePercent = 1.0;
        minAmount = 500000; // 5 Lacs
        break;
      case 'Business Loan':
        ratePercent = 1.0;
        minAmount = 1000000; // 10 Lacs
        break;
      default:
        ratePercent = 0.5;
        minAmount = 500000;
    }

    const calculatedCommission = amount * (ratePercent / 100);

    return res.json({
      success: true,
      loanProduct,
      loanAmount: amount,
      commissionRatePercent: ratePercent,
      estimatedCommission: Math.round(calculatedCommission),
      formattedCommission: `₹ ${Math.round(calculatedCommission).toLocaleString('en-IN')}`,
      payoutSpeed: 'Instant 24x7 via UPI / IMPS upon bank disbursal'
    });
  } catch (err) {
    console.error('[ProductService] Calculation error:', err);
    return res.status(500).json({ error: 'Commission calculation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`[ProductService] 🏷️ Microservice running on port ${PORT}`);
});
