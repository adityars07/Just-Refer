import express from 'express';
import cors from 'cors';
import { query } from '../shared/db.js';

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 4001;

app.use(cors());
app.use(express.json());

// Helper to generate referral code
function generateReferralCode(name) {
  const clean = (name || 'JR').replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `JR-${clean}${rand}`;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'auth-service', status: 'healthy', port: PORT });
});

// Register Partner (Frictionless, ZERO KYC)
app.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, upiId } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ error: 'Full name and phone number are required' });
    }

    const cleanEmail = email || `${phone.replace(/\D/g, '')}@partner.justrefer.in`;
    const referralCode = generateReferralCode(fullName);

    // Insert partner
    const insertPartner = `
      INSERT INTO partners (full_name, email, phone, password_hash, referral_code, payout_upi_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, full_name, email, phone, referral_code, payout_upi_id, created_at;
    `;
    const result = await query(insertPartner, [
      fullName,
      cleanEmail,
      phone,
      password || 'default_pass',
      referralCode,
      upiId || null
    ]);

    const newPartner = result.rows[0];

    // Initialize partner wallet
    await query(
      `INSERT INTO partner_wallets (partner_id, available_balance, total_earned, total_withdrawn)
       VALUES ($1, 0, 0, 0) ON CONFLICT DO NOTHING;`,
      [newPartner.id]
    );

    return res.status(201).json({
      success: true,
      message: 'Partner registered successfully (Zero KYC required)',
      partner: newPartner,
      token: `jwt_dummy_${newPartner.id}`
    });
  } catch (err) {
    console.error('[AuthService] Register error:', err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A partner with this phone or email already exists' });
    }
    return res.status(500).json({ error: 'Failed to register partner' });
  }
});

// Partner Login
app.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const findQuery = `
      SELECT id, full_name, email, phone, referral_code, payout_upi_id, bank_account_no, bank_ifsc, bank_name
      FROM partners
      WHERE phone = $1 OR email = $1;
    `;
    const result = await query(findQuery, [identifier]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials. Partner not found.' });
    }

    const partner = result.rows[0];
    return res.json({
      success: true,
      partner,
      token: `jwt_dummy_${partner.id}`
    });
  } catch (err) {
    console.error('[AuthService] Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Get Partner Profile
app.get('/partner/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT id, full_name, email, phone, referral_code, payout_upi_id, bank_account_no, bank_ifsc, bank_name, created_at
       FROM partners WHERE id = $1;`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    return res.json({ partner: result.rows[0] });
  } catch (err) {
    console.error('[AuthService] Get partner error:', err);
    return res.status(500).json({ error: 'Failed to retrieve partner profile' });
  }
});

// Update Partner Payout Info (Instant UPI ID or Bank Account)
app.put('/partner/:id/payout', async (req, res) => {
  try {
    const { id } = req.params;
    const { payoutUpiId, bankAccountNo, bankIfsc, bankName } = req.body;

    const updateQuery = `
      UPDATE partners
      SET payout_upi_id = COALESCE($1, payout_upi_id),
          bank_account_no = COALESCE($2, bank_account_no),
          bank_ifsc = COALESCE($3, bank_ifsc),
          bank_name = COALESCE($4, bank_name),
          updated_at = NOW()
      WHERE id = $5
      RETURNING id, full_name, payout_upi_id, bank_account_no, bank_ifsc, bank_name;
    `;
    const result = await query(updateQuery, [payoutUpiId, bankAccountNo, bankIfsc, bankName, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    return res.json({
      success: true,
      message: 'Payout destination updated successfully',
      partner: result.rows[0]
    });
  } catch (err) {
    console.error('[AuthService] Update payout error:', err);
    return res.status(500).json({ error: 'Failed to update payout details' });
  }
// Get All Partners (Admin)
app.get('/partners', async (req, res) => {
  try {
    const result = await query(
      `SELECT p.id, p.full_name, p.email, p.phone, p.referral_code, p.payout_upi_id, p.created_at,
              COALESCE(w.total_earned, 0) as total_earned,
              (SELECT count(*) FROM referral_leads l WHERE l.partner_id = p.id) as lead_count
       FROM partners p
       LEFT JOIN partner_wallets w ON p.id = w.partner_id
       ORDER BY p.created_at DESC;`
    );
    return res.json({ success: true, partners: result.rows });
  } catch (err) {
    console.error('[AuthService] Get all partners error:', err);
    return res.status(500).json({ error: 'Failed to retrieve partners' });
  }
});

app.listen(PORT, () => {
  console.log(`[AuthService] 🛡️ Microservice running on port ${PORT}`);
});
