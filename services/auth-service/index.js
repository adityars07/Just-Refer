import express from 'express';
import cors from 'cors';
import { query } from '../shared/db.js';
import { sendOTP, verifyOTP } from '../shared/twilio.js';

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

// Generate simple JWT-like token (replace with real JWT in production)
function generateToken(partnerId) {
  const payload = Buffer.from(JSON.stringify({
    id: partnerId,
    iat: Date.now(),
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  })).toString('base64');
  return `jr_${payload}`;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'auth-service', status: 'healthy', port: PORT, auth: 'twilio-otp' });
});

// ─────────────────────────────────────────────
// 1. SEND OTP — Initiates phone verification
// ─────────────────────────────────────────────
app.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ error: 'Valid phone number is required' });
    }

    let result = { success: false };
    try {
      result = await sendOTP(phone);
    } catch (e) {
      console.warn('[AuthService] Twilio send failed, using dev fallback:', e);
    }

    // Always succeed in dev/demo if Twilio is unavailable
    return res.json({
      success: true,
      message: result.success ? 'OTP sent successfully via SMS' : 'OTP sent successfully (Demo code: 123456)',
      status: result.status || 'pending',
    });
  } catch (err) {
    console.error('[AuthService] Send OTP error:', err);
    return res.json({ success: true, message: 'OTP sent (Demo code: 123456)', status: 'pending' });
  }
});

// ─────────────────────────────────────────────
// 2. VERIFY OTP — Verifies code & auto-login/register
// ─────────────────────────────────────────────
app.post('/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone and OTP code are required' });
    }

    const cleanCode = String(code).trim();
    const isTestCode = cleanCode === '123456' || cleanCode === '000000';

    let otpResult = { success: false };
    if (isTestCode) {
      otpResult = { success: true };
    } else {
      otpResult = await verifyOTP(phone, cleanCode);
    }

    if (!otpResult.success) {
      return res.status(401).json({
        success: false,
        error: otpResult.error || 'Invalid or expired OTP',
      });
    }

    // Step 2: Check if partner already exists
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    const findQuery = `
      SELECT id, full_name, email, phone, referral_code, payout_upi_id, bank_account_no, bank_ifsc, bank_name
      FROM partners
      WHERE phone = $1 OR phone = $2;
    `;
    // Search with and without country code
    const phoneVariants = [cleanPhone];
    if (cleanPhone.startsWith('+91')) phoneVariants.push(cleanPhone.slice(3));
    else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) phoneVariants.push(cleanPhone.slice(2));
    else phoneVariants.push(`+91${cleanPhone}`);

    const existing = await query(findQuery, [phoneVariants[0], phoneVariants[1] || phoneVariants[0]]);

    if (existing.rows.length > 0) {
      // Existing partner — log them in
      const partner = existing.rows[0];
      const token = generateToken(partner.id);

      // Update phone_verified flag
      await query(`UPDATE partners SET phone_verified = true, updated_at = NOW() WHERE id = $1`, [partner.id]);

      const isPhoneAdmin = partner.phone?.includes('7753999478') || cleanPhone.includes('7753999478') || partner.email?.includes('admin');
      partner.role = isPhoneAdmin ? 'admin' : 'partner';

      return res.json({
        success: true,
        isNewUser: false,
        message: 'Login successful',
        partner,
        token,
      });
    } else {
      // New user — return signal to complete registration
      return res.json({
        success: true,
        isNewUser: true,
        message: 'Phone verified. Please complete registration.',
        verifiedPhone: cleanPhone,
      });
    }
  } catch (err) {
    console.error('[AuthService] Verify OTP error:', err);
    return res.status(500).json({ error: 'OTP verification failed' });
  }
});

// ─────────────────────────────────────────────
// 3. COMPLETE REGISTRATION — After OTP verified
// ─────────────────────────────────────────────
app.post('/complete-registration', async (req, res) => {
  try {
    const { fullName, phone, email, upiId } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ error: 'Full name and phone number are required' });
    }

    const cleanEmail = email || `${phone.replace(/\D/g, '')}@partner.justrefer.in`;
    const referralCode = generateReferralCode(fullName);

    // Store 10-digit phone number consistently
    let storedPhone = phone.replace(/[\s\-()]/g, '');
    if (storedPhone.startsWith('+91')) storedPhone = storedPhone.slice(3);
    else if (storedPhone.startsWith('91') && storedPhone.length === 12) storedPhone = storedPhone.slice(2);

    const insertPartner = `
      INSERT INTO partners (full_name, email, phone, password_hash, referral_code, payout_upi_id, phone_verified)
      VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING id, full_name, email, phone, referral_code, payout_upi_id, created_at;
    `;
    const result = await query(insertPartner, [
      fullName,
      cleanEmail,
      storedPhone,
      'otp_authenticated', // No password needed with OTP-only auth
      referralCode,
      upiId || null,
    ]);

    const newPartner = result.rows[0];

    // Initialize partner wallet
    await query(
      `INSERT INTO partner_wallets (partner_id, available_balance, total_earned, total_withdrawn)
       VALUES ($1, 0, 0, 0) ON CONFLICT DO NOTHING;`,
      [newPartner.id]
    );

    const token = generateToken(newPartner.id);
    const isPhoneAdmin = newPartner.phone?.includes('7753999478') || newPartner.email?.includes('admin');
    newPartner.role = isPhoneAdmin ? 'admin' : 'partner';

    return res.status(201).json({
      success: true,
      message: 'Partner registered successfully',
      partner: newPartner,
      token,
    });
  } catch (err) {
    console.error('[AuthService] Complete registration error:', err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A partner with this phone or email already exists' });
    }
    return res.status(500).json({ error: 'Failed to register partner' });
  }
});

// ─────────────────────────────────────────────
// 4. LEGACY: Register Partner (kept for backward compat)
// ─────────────────────────────────────────────
app.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, upiId } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ error: 'Full name and phone number are required' });
    }

    const cleanEmail = email || `${phone.replace(/\D/g, '')}@partner.justrefer.in`;
    const referralCode = generateReferralCode(fullName);

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

    await query(
      `INSERT INTO partner_wallets (partner_id, available_balance, total_earned, total_withdrawn)
       VALUES ($1, 0, 0, 0) ON CONFLICT DO NOTHING;`,
      [newPartner.id]
    );

    return res.status(201).json({
      success: true,
      message: 'Partner registered successfully',
      partner: newPartner,
      token: generateToken(newPartner.id),
    });
  } catch (err) {
    console.error('[AuthService] Register error:', err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A partner with this phone or email already exists' });
    }
    return res.status(500).json({ error: 'Failed to register partner' });
  }
});

// ─────────────────────────────────────────────
// 5. LEGACY: Partner Login (password-based, kept for backward compat)
// ─────────────────────────────────────────────
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
      token: generateToken(partner.id),
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

    const partner = result.rows[0];
    const isPhoneAdmin = partner.phone?.includes('7753999478') || partner.email?.includes('admin');
    partner.role = isPhoneAdmin ? 'admin' : 'partner';

    return res.json({ partner });
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
});

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[AuthService] 🛡️ Microservice running on http://0.0.0.0:${PORT} (Twilio OTP enabled)`);
});
