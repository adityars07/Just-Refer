import fs from 'fs';
import path from 'path';
import { Referral, BankAccount, Withdrawal, WithdrawalStatus } from '../../../shared/types.js';
import { encryptAccountNumber, maskAccountNumber } from '../services/crypto.js';
import { lookupIFSC } from '../services/ifsc.js';
import { ReferralRepo, referralRepo } from './referralRepo.js';
import { pool } from '../db.js';

function getStoreFilePath(filename: string): string {
  const possiblePaths = [
    path.resolve(process.cwd(), `server/src/data/${filename}`),
    path.resolve(process.cwd(), `src/data/${filename}`),
    path.resolve(process.cwd(), filename),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

export interface WithdrawalRepo {
  getBankAccount(partnerId: string): Promise<BankAccount | null>;
  saveBankAccount(
    partnerId: string,
    data: { holderName: string; accountNumber: string; ifsc: string; bankName?: string }
  ): Promise<BankAccount>;
  getPartnerAvailableBalance(partnerId: string): Promise<number>;
  createWithdrawal(
    partnerId: string,
    partnerName: string,
    data: {
      amount: number;
      saveDetails?: boolean;
      holderName?: string;
      accountNumber?: string;
      ifsc?: string;
    }
  ): Promise<Withdrawal>;
  getPartnerWithdrawals(partnerId: string): Promise<Withdrawal[]>;
  getAllWithdrawals(): Promise<Withdrawal[]>;
  updateWithdrawalStatus(
    id: string,
    status: WithdrawalStatus,
    data: { utr?: string; rejectReason?: string; admin: string }
  ): Promise<Withdrawal>;
  clear(): void;
}

export class InMemoryWithdrawalRepo implements WithdrawalRepo {
  private referralRepo: ReferralRepo;
  private bankAccounts: Map<string, BankAccount & { accountNumberEnc: string }> = new Map();
  private withdrawals: Withdrawal[] = [];
  private partnerLocks: Map<string, Promise<any>> = new Map();

  constructor(refRepo: ReferralRepo = referralRepo) {
    this.referralRepo = refRepo;
    this.loadFromDisk();
  }

  private loadFromDisk() {
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      return;
    }
    try {
      const pBank = getStoreFilePath('bank_accounts_store.json');
      if (fs.existsSync(pBank)) {
        const raw = fs.readFileSync(pBank, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            this.bankAccounts.set(item.partnerId, item);
          }
        }
      }

      const pWd = getStoreFilePath('withdrawals_store.json');
      if (fs.existsSync(pWd)) {
        const raw = fs.readFileSync(pWd, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.withdrawals = parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  private saveToDisk() {
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      return;
    }
    try {
      const pBank = getStoreFilePath('bank_accounts_store.json');
      fs.mkdirSync(path.dirname(pBank), { recursive: true });
      fs.writeFileSync(pBank, JSON.stringify(Array.from(this.bankAccounts.values()), null, 2), 'utf8');

      const pWd = getStoreFilePath('withdrawals_store.json');
      fs.mkdirSync(path.dirname(pWd), { recursive: true });
      fs.writeFileSync(pWd, JSON.stringify(this.withdrawals, null, 2), 'utf8');
    } catch {
      // ignore
    }
  }

  clear(): void {
    this.bankAccounts.clear();
    this.withdrawals = [];
  }

  async getBankAccount(partnerId: string): Promise<BankAccount | null> {
    // Try DB first if available
    try {
      const res = await pool.query(
        `SELECT partner_id, holder_name, account_number_last4, ifsc, bank_name, updated_at
         FROM bank_accounts
         WHERE partner_id = $1;`,
        [partnerId]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          partnerId: row.partner_id,
          holderName: row.holder_name,
          accountNumberMasked: `•••• ${row.account_number_last4}`,
          ifsc: row.ifsc,
          bankName: row.bank_name || undefined,
          updatedAt: new Date(row.updated_at).toISOString(),
        };
      }
    } catch {
      // fallback to memory
    }

    const item = this.bankAccounts.get(partnerId);
    if (!item) return null;
    return {
      partnerId: item.partnerId,
      holderName: item.holderName,
      accountNumberMasked: item.accountNumberMasked,
      ifsc: item.ifsc,
      bankName: item.bankName,
      updatedAt: item.updatedAt,
    };
  }

  async saveBankAccount(
    partnerId: string,
    data: { holderName: string; accountNumber: string; ifsc: string; bankName?: string }
  ): Promise<BankAccount> {
    const enc = encryptAccountNumber(data.accountNumber);
    const masked = maskAccountNumber(data.accountNumber);
    const last4 = data.accountNumber.replace(/\s+/g, '').slice(-4);
    const nowIso = new Date().toISOString();

    let bankName = data.bankName;
    if (!bankName) {
      const lookup = await lookupIFSC(data.ifsc);
      if (lookup.valid && lookup.bankName) {
        bankName = lookup.bankName;
      }
    }

    // Try DB
    try {
      await pool.query(
        `INSERT INTO bank_accounts (partner_id, holder_name, account_number_enc, account_number_last4, ifsc, bank_name, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (partner_id)
         DO UPDATE SET
           holder_name = EXCLUDED.holder_name,
           account_number_enc = EXCLUDED.account_number_enc,
           account_number_last4 = EXCLUDED.account_number_last4,
           ifsc = EXCLUDED.ifsc,
           bank_name = EXCLUDED.bank_name,
           updated_at = NOW();`,
        [partnerId, data.holderName, enc, last4, data.ifsc.toUpperCase(), bankName || null]
      );
    } catch {
      // fallback to memory
    }

    const saved: BankAccount & { accountNumberEnc: string } = {
      partnerId,
      holderName: data.holderName,
      accountNumberMasked: masked,
      accountNumberEnc: enc,
      ifsc: data.ifsc.toUpperCase(),
      bankName,
      updatedAt: nowIso,
    };

    this.bankAccounts.set(partnerId, saved);
    this.saveToDisk();

    return {
      partnerId,
      holderName: data.holderName,
      accountNumberMasked: masked,
      ifsc: data.ifsc.toUpperCase(),
      bankName,
      updatedAt: nowIso,
    };
  }

  async getPartnerAvailableBalance(partnerId: string): Promise<number> {
    const allReferrals = await this.referralRepo.getAllReferrals();
    // Sum commissions of disbursed referrals for this partner
    // (matches partner name or phone if present, or all disbursed if single partner)
    const partnerDisbursed = allReferrals.filter((r: Referral) => r.status === 'disbursed');
    const totalEarned = partnerDisbursed.reduce((sum: number, r: Referral) => sum + (r.commission || 0), 0);

    const partnerWds = await this.getPartnerWithdrawals(partnerId);
    const activeWithheld = partnerWds
      .filter((w) => w.status === 'requested' || w.status === 'processing' || w.status === 'paid')
      .reduce((sum, w) => sum + w.amount, 0);

    return Math.max(0, totalEarned - activeWithheld);
  }

  async createWithdrawal(
    partnerId: string,
    partnerName: string,
    data: {
      amount: number;
      saveDetails?: boolean;
      holderName?: string;
      accountNumber?: string;
      ifsc?: string;
    }
  ): Promise<Withdrawal> {
    // Partner-level mutex lock to prevent concurrent double-withdrawals
    const currentLock = this.partnerLocks.get(partnerId) || Promise.resolve();
    let releaseLock: () => void;
    const nextLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    this.partnerLocks.set(partnerId, currentLock.then(() => nextLock));

    await currentLock;

    try {
      const amount = Math.round(data.amount * 100) / 100;
      if (amount < 500) {
        throw new Error('Minimum withdrawal amount is ₹500');
      }

      const available = await this.getPartnerAvailableBalance(partnerId);
      if (amount > available) {
        throw new Error(
          `Insufficient available balance. Available: ₹${available.toLocaleString('en-IN')}, requested: ₹${amount.toLocaleString('en-IN')}`
        );
      }

      // Determine bank snapshot
      let bankSnapshot: {
        holderName: string;
        accountNumberMasked: string;
        ifsc: string;
        bankName?: string;
      };

      if (data.holderName && data.accountNumber && data.ifsc) {
        const masked = maskAccountNumber(data.accountNumber);
        let bankName: string | undefined;
        const lookup = await lookupIFSC(data.ifsc);
        if (lookup.valid && lookup.bankName) {
          bankName = lookup.bankName;
        }

        bankSnapshot = {
          holderName: data.holderName,
          accountNumberMasked: masked,
          ifsc: data.ifsc.toUpperCase(),
          bankName,
        };

        if (data.saveDetails !== false) {
          await this.saveBankAccount(partnerId, {
            holderName: data.holderName,
            accountNumber: data.accountNumber,
            ifsc: data.ifsc,
            bankName,
          });
        }
      } else {
        const saved = await this.getBankAccount(partnerId);
        if (!saved) {
          throw new Error('Bank account details are required for withdrawal');
        }
        bankSnapshot = {
          holderName: saved.holderName,
          accountNumberMasked: saved.accountNumberMasked,
          ifsc: saved.ifsc,
          bankName: saved.bankName,
        };
      }

      const id = `wd_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
      const nowIso = new Date().toISOString();

      const newWithdrawal: Withdrawal = {
        id,
        partnerId,
        partnerName: partnerName || 'Partner',
        amount,
        status: 'requested',
        bankSnapshot,
        requestedAt: nowIso,
        updatedAt: nowIso,
        history: [
          {
            admin: partnerName || 'Partner',
            timestamp: nowIso,
            fromStatus: 'none',
            toStatus: 'requested',
            note: 'Withdrawal requested by partner',
          },
        ],
      };

      // DB Transaction
      try {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          await client.query(
            `INSERT INTO withdrawals (id, partner_id, amount, status, bank_snapshot, history, requested_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW());`,
            [
              newWithdrawal.id,
              newWithdrawal.partnerId,
              newWithdrawal.amount,
              newWithdrawal.status,
              JSON.stringify(newWithdrawal.bankSnapshot),
              JSON.stringify(newWithdrawal.history),
            ]
          );
          await client.query('COMMIT');
        } catch (dbErr) {
          await client.query('ROLLBACK');
          throw dbErr;
        } finally {
          client.release();
        }
      } catch {
        // In-memory fallback
      }

      this.withdrawals.unshift(newWithdrawal);
      this.saveToDisk();

      return newWithdrawal;
    } finally {
      releaseLock!();
    }
  }

  async getPartnerWithdrawals(partnerId: string): Promise<Withdrawal[]> {
    try {
      const res = await pool.query(
        `SELECT id, partner_id, amount, status, bank_snapshot, utr, reject_reason, history, requested_at, updated_at
         FROM withdrawals
         WHERE partner_id = $1
         ORDER BY requested_at DESC;`,
        [partnerId]
      );
      if (res.rows.length > 0) {
        return res.rows.map((row) => ({
          id: row.id,
          partnerId: row.partner_id,
          amount: parseFloat(row.amount),
          status: row.status,
          bankSnapshot: typeof row.bank_snapshot === 'string' ? JSON.parse(row.bank_snapshot) : row.bank_snapshot,
          utr: row.utr || undefined,
          rejectReason: row.reject_reason || undefined,
          history: typeof row.history === 'string' ? JSON.parse(row.history) : row.history,
          requestedAt: new Date(row.requested_at).toISOString(),
          updatedAt: new Date(row.updated_at).toISOString(),
        }));
      }
    } catch {
      // fallback
    }

    return this.withdrawals
      .filter((w) => w.partnerId === partnerId)
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  }

  async getAllWithdrawals(): Promise<Withdrawal[]> {
    try {
      const res = await pool.query(
        `SELECT id, partner_id, amount, status, bank_snapshot, utr, reject_reason, history, requested_at, updated_at
         FROM withdrawals
         ORDER BY requested_at DESC;`
      );
      if (res.rows.length > 0) {
        return res.rows.map((row) => ({
          id: row.id,
          partnerId: row.partner_id,
          amount: parseFloat(row.amount),
          status: row.status,
          bankSnapshot: typeof row.bank_snapshot === 'string' ? JSON.parse(row.bank_snapshot) : row.bank_snapshot,
          utr: row.utr || undefined,
          rejectReason: row.reject_reason || undefined,
          history: typeof row.history === 'string' ? JSON.parse(row.history) : row.history,
          requestedAt: new Date(row.requested_at).toISOString(),
          updatedAt: new Date(row.updated_at).toISOString(),
        }));
      }
    } catch {
      // fallback
    }

    return [...this.withdrawals].sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );
  }

  async updateWithdrawalStatus(
    id: string,
    status: WithdrawalStatus,
    data: { utr?: string; rejectReason?: string; admin: string }
  ): Promise<Withdrawal> {
    const item = this.withdrawals.find((w) => w.id === id);
    const oldStatus = item ? item.status : 'requested';
    const nowIso = new Date().toISOString();

    const historyEntry = {
      admin: data.admin,
      timestamp: nowIso,
      fromStatus: oldStatus,
      toStatus: status,
      note:
        status === 'paid'
          ? `Marked paid with UTR ${data.utr}`
          : status === 'rejected'
          ? `Rejected: ${data.rejectReason}`
          : `Status changed to ${status}`,
    };

    // Try DB
    try {
      await pool.query(
        `UPDATE withdrawals
         SET
           status = $1,
           utr = COALESCE($2, utr),
           reject_reason = COALESCE($3, reject_reason),
           updated_at = NOW(),
           history = COALESCE(history, '[]'::jsonb) || $4::jsonb
         WHERE id = $5;`,
        [status, data.utr || null, data.rejectReason || null, JSON.stringify([historyEntry]), id]
      );
    } catch {
      // fallback
    }

    if (!item) {
      throw new Error(`Withdrawal with id "${id}" not found`);
    }

    item.status = status;
    item.updatedAt = nowIso;
    if (data.utr) item.utr = data.utr;
    if (data.rejectReason) item.rejectReason = data.rejectReason;
    if (!item.history) item.history = [];
    item.history.push(historyEntry);

    this.saveToDisk();
    return { ...item };
  }
}

export const withdrawalRepo = new InMemoryWithdrawalRepo();

