-- Migration 001: Create bank_accounts and withdrawals tables
CREATE TABLE IF NOT EXISTS bank_accounts (
  partner_id VARCHAR(255) PRIMARY KEY,
  holder_name VARCHAR(255) NOT NULL,
  account_number_enc TEXT NOT NULL,
  account_number_last4 VARCHAR(10) NOT NULL,
  ifsc VARCHAR(20) NOT NULL,
  bank_name VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS withdrawals (
  id VARCHAR(255) PRIMARY KEY,
  partner_id VARCHAR(255) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'requested',
  bank_snapshot JSONB NOT NULL,
  utr VARCHAR(255),
  reject_reason TEXT,
  history JSONB DEFAULT '[]'::jsonb,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_partner_id ON withdrawals(partner_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);

