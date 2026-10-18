import express from 'express';
import cors from 'cors';
import { query } from '../shared/db.js';
import { eventBus } from '../shared/eventBus.js';

const app = express();
const PORT = process.env.WALLET_SERVICE_PORT || 4003;

app.use(cors());
app.use(express.json());

// Event Listener: Automatic Commission Crediting on Loan Disbursal
eventBus.subscribe('lead.disbursed', async (data) => {
  console.log('[WalletService] 💰 Processing commission credit for disbursed loan:', data);
  try {
    const { partnerId, leadId, commissionAmount } = data;
    const comm = parseFloat(commissionAmount) || 0;
    if (comm <= 0) return;

    // 1. Credit wallet
    await query(
      `UPDATE partner_wallets
       SET available_balance = available_balance + $1,
           total_earned = total_earned + $1,
           updated_at = NOW()
       WHERE partner_id = $2;`,
      [comm, partnerId]
    );

    // 2. Add ledger transaction
    const refId = `TXN-COMM-${Date.now()}`;
    await query(
      `INSERT INTO wallet_transactions (partner_id, lead_id, type, amount, status, reference_id)
       VALUES ($1, $2, 'CREDIT_COMMISSION', $3, 'COMPLETED', $4);`,
      [partnerId, leadId, comm, refId]
    );

    console.log(`[WalletService] ✅ Successfully credited ₹${comm} to partner ${partnerId}`);
    eventBus.publish('wallet.credited', {
      partnerId,
      commissionAmount: comm,
      referenceId: refId
    });
  } catch (err) {
    console.error('[WalletService] Error in automatic commission credit:', err);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'wallet-service', status: 'healthy', port: PORT });
});

// Get Partner Wallet Balance
app.get('/partner/:partnerId', async (req, res) => {
  try {
    const { partnerId } = req.params;
    const result = await query(
      `SELECT available_balance, total_earned, total_withdrawn, updated_at
       FROM partner_wallets
       WHERE partner_id = $1;`,
      [partnerId]
    );

    if (result.rows.length === 0) {
      // Auto-create wallet if missing
      await query(
        `INSERT INTO partner_wallets (partner_id, available_balance, total_earned, total_withdrawn)
         VALUES ($1, 0, 0, 0) ON CONFLICT DO NOTHING;`,
        [partnerId]
      );
      return res.json({
        wallet: { available_balance: '0.00', total_earned: '0.00', total_withdrawn: '0.00' }
      });
    }

    return res.json({ wallet: result.rows[0] });
  } catch (err) {
    console.error('[WalletService] Get wallet error:', err);
    return res.status(500).json({ error: 'Failed to retrieve wallet details' });
  }
});

// Get Wallet Transactions (Ledger)
app.get('/partner/:partnerId/transactions', async (req, res) => {
  try {
    const { partnerId } = req.params;
    const result = await query(
      `SELECT t.*, l.applicant_name, l.loan_product
       FROM wallet_transactions t
       LEFT JOIN referral_leads l ON t.lead_id = l.id
       WHERE t.partner_id = $1
       ORDER BY t.created_at DESC;`,
      [partnerId]
    );

    return res.json({
      transactions: result.rows
    });
  } catch (err) {
    console.error('[WalletService] Get transactions error:', err);
    return res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
});

// Request Instant Payout (UPI / Bank Account)
app.post('/withdraw', async (req, res) => {
  try {
    const { partnerId, amount } = req.body;
    const withdrawAmt = parseFloat(amount);

    if (!withdrawAmt || withdrawAmt <= 0) {
      return res.status(400).json({ error: 'A valid withdrawal amount is required' });
    }

    // Check available balance
    const checkBalance = await query(
      `SELECT available_balance FROM partner_wallets WHERE partner_id = $1;`,
      [partnerId]
    );

    if (checkBalance.rows.length === 0 || parseFloat(checkBalance.rows[0].available_balance) < withdrawAmt) {
      return res.status(400).json({ error: 'Insufficient wallet balance for this withdrawal' });
    }

    // Get partner payout method
    const partnerInfo = await query(
      `SELECT full_name, payout_upi_id, bank_account_no, bank_ifsc FROM partners WHERE id = $1;`,
      [partnerId]
    );
    const partner = partnerInfo.rows[0] || {};
    const destination = partner.payout_upi_id || partner.bank_account_no || 'Registered UPI ID';

    // Deduct balance
    await query(
      `UPDATE partner_wallets
       SET available_balance = available_balance - $1,
           total_withdrawn = total_withdrawn + $1,
           updated_at = NOW()
       WHERE partner_id = $2;`,
      [withdrawAmt, partnerId]
    );

    // Record withdrawal transaction
    const refId = `WD-${Date.now()}`;
    const txnResult = await query(
      `INSERT INTO wallet_transactions (partner_id, type, amount, status, reference_id)
       VALUES ($1, 'WITHDRAWAL', $2, 'COMPLETED', $3)
       RETURNING *;`,
      [partnerId, withdrawAmt, refId]
    );

    eventBus.publish('payout.requested', {
      partnerId,
      amount: withdrawAmt,
      referenceId: refId,
      destination
    });

    return res.json({
      success: true,
      message: `Instant payout of ₹${withdrawAmt.toLocaleString('en-IN')} dispatched to ${destination}!`,
      transaction: txnResult.rows[0]
    });
  } catch (err) {
    console.error('[WalletService] Withdrawal error:', err);
    return res.status(500).json({ error: 'Withdrawal processing failed' });
  }
});

app.listen(PORT, () => {
  console.log(`[WalletService] 💳 Microservice running on port ${PORT}`);
});
