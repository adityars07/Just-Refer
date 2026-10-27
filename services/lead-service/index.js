import express from 'express';
import cors from 'cors';
import { query } from '../shared/db.js';
import { eventBus } from '../shared/eventBus.js';

const app = express();
const PORT = process.env.LEAD_SERVICE_PORT || 4002;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'lead-service', status: 'healthy', port: PORT });
});

// Fast Lead Intake (Zero KYC Required)
app.post('/', async (req, res) => {
  try {
    const {
      partnerId = '00000000-0000-0000-0000-000000000001',
      applicantName,
      applicantPhone,
      applicantCity = 'Mumbai',
      loanProduct,
      loanAmount,
      notes = ''
    } = req.body;

    if (!applicantName || !applicantPhone || !loanProduct || !loanAmount) {
      return res.status(400).json({
        error: 'applicantName, applicantPhone, loanProduct, and loanAmount are required'
      });
    }

    // Default Bank assignment heuristics based on loan product
    let assignedBank = 'HDFC Bank';
    if (loanProduct === 'Business Loan') assignedBank = 'ICICI Bank';
    if (loanProduct === 'Personal Loan') assignedBank = 'Axis Bank';
    if (loanProduct === 'Loan Against Property') assignedBank = 'Kotak Mahindra Bank';

    // Calculate commission strictly per official guidelines:
    // Home Loan: 0.3%
    // LAP: 0.5%
    // Personal Loan: 1%
    // Business Loan: 1%
    const numAmt = parseFloat(loanAmount);
    let estimatedCommission = numAmt * 0.003; // 0.3% default
    if (loanProduct === 'Home Loan') estimatedCommission = numAmt * 0.003;
    if (loanProduct === 'Loan Against Property') estimatedCommission = numAmt * 0.005;
    if (loanProduct === 'Personal Loan') estimatedCommission = numAmt * 0.01;
    if (loanProduct === 'Business Loan') estimatedCommission = numAmt * 0.01;

    const insertSql = `
      INSERT INTO referral_leads (
        partner_id, applicant_name, applicant_phone, applicant_city,
        loan_product, loan_amount, assigned_bank, status, commission_amount, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Submitted', $8, $9)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      partnerId,
      applicantName,
      applicantPhone,
      applicantCity,
      loanProduct,
      numAmt,
      assignedBank,
      estimatedCommission,
      notes
    ]);

    const lead = result.rows[0];

    // Emit event asynchronously
    eventBus.publish('lead.created', {
      leadId: lead.id,
      partnerId: lead.partner_id,
      applicantName: lead.applicant_name,
      loanProduct: lead.loan_product,
      loanAmount: lead.loan_amount
    });

    return res.status(201).json({
      success: true,
      message: 'Referral submitted successfully! (Zero KYC needed)',
      lead
    });
  } catch (err) {
    console.error('[LeadService] Create lead error:', err);
    return res.status(500).json({ error: 'Failed to create referral lead' });
  }
});

// Get Leads for a Partner
app.get('/partner/:partnerId', async (req, res) => {
  try {
    const { partnerId } = req.params;
    const result = await query(
      `SELECT * FROM referral_leads
       WHERE partner_id = $1
       ORDER BY created_at DESC;`,
      [partnerId]
    );

    return res.json({
      success: true,
      count: result.rows.length,
      leads: result.rows
    });
  } catch (err) {
    console.error('[LeadService] Get leads error:', err);
    return res.status(500).json({ error: 'Failed to retrieve referral leads' });
  }
});

// Get All Leads (Admin)
app.get('/all', async (req, res) => {
  try {
    const result = await query(
      `SELECT l.*, p.full_name as partner_name, p.phone as partner_phone, p.email as partner_email
       FROM referral_leads l
       LEFT JOIN partners p ON l.partner_id = p.id
       ORDER BY l.created_at DESC;`
    );
    return res.json({
      success: true,
      count: result.rows.length,
      leads: result.rows
    });
  } catch (err) {
    console.error('[LeadService] Get all leads error:', err);
    return res.status(500).json({ error: 'Failed to retrieve referral leads' });
  }
});

// Update Lead Status (Bank underwriting simulation / Admin action)
app.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, commissionAmount } = req.body;

    const validStatuses = ['Submitted', 'In Review', 'Sanctioned', 'Disbursed', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updateSql = `
      UPDATE referral_leads
      SET status = $1,
          commission_amount = COALESCE($2, commission_amount),
          updated_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;

    const result = await query(updateSql, [status, commissionAmount, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const updatedLead = result.rows[0];

    // Emit status change event
    eventBus.publish('lead.status_updated', {
      leadId: updatedLead.id,
      partnerId: updatedLead.partner_id,
      status: updatedLead.status
    });

    // If disbursed, emit special lead.disbursed event to trigger commission crediting
    if (status === 'Disbursed') {
      eventBus.publish('lead.disbursed', {
        leadId: updatedLead.id,
        partnerId: updatedLead.partner_id,
        applicantName: updatedLead.applicant_name,
        loanProduct: updatedLead.loan_product,
        loanAmount: updatedLead.loan_amount,
        commissionAmount: updatedLead.commission_amount
      });
    }

    return res.json({
      success: true,
      lead: updatedLead
    });
  } catch (err) {
    console.error('[LeadService] Update lead status error:', err);
    return res.status(500).json({ error: 'Failed to update lead status' });
  }
});

app.listen(PORT, () => {
  console.log(`[LeadService] 📋 Microservice running on port ${PORT}`);
});
