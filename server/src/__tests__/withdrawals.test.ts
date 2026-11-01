import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryWithdrawalRepo } from '../repo/withdrawalRepo.js';
import { InMemoryReferralRepo } from '../repo/referralRepo.js';
import { encryptAccountNumber, decryptAccountNumber, maskAccountNumber } from '../services/crypto.js';

describe('Bank Account Encryption & Masking', () => {
  it('encrypts account number at rest and decrypts accurately', () => {
    const originalAcc = '50100234567890';
    const encrypted = encryptAccountNumber(originalAcc);

    expect(encrypted).not.toBe(originalAcc);
    expect(encrypted.split(':')).toHaveLength(3); // iv:tag:ciphertext

    const decrypted = decryptAccountNumber(encrypted);
    expect(decrypted).toBe(originalAcc);
  });

  it('masks account number showing only last 4 digits', () => {
    expect(maskAccountNumber('50100234567890')).toBe('•••• 7890');
    expect(maskAccountNumber('123456789')).toBe('•••• 6789');
  });
});

describe('Withdrawal Repository & Concurrency Rules', () => {
  let refRepo: InMemoryReferralRepo;
  let wdRepo: InMemoryWithdrawalRepo;
  const partnerId = '7753999478';
  const partnerName = 'Aditya Raj Singh';

  beforeEach(async () => {
    refRepo = new InMemoryReferralRepo();
    refRepo.clear();
    wdRepo = new InMemoryWithdrawalRepo(refRepo);
    wdRepo.clear();

    // Create disbursed referrals to provide 1,00,000 commission
    await refRepo.create({
      applicant: 'Test Disbursed 1',
      city: 'Mumbai',
      productId: 'business',
      loanAmount: 10000000,
      partnerName: 'Aditya Raj Singh',
      status: 'disbursed',
    });
  });

  it('saves and retrieves bank account with masked account number', async () => {
    const saved = await wdRepo.saveBankAccount(partnerId, {
      holderName: 'Aditya Raj Singh',
      accountNumber: '50100234567890',
      ifsc: 'HDFC0000123',
      bankName: 'HDFC Bank • Fort, Mumbai',
    });

    expect(saved.holderName).toBe('Aditya Raj Singh');
    expect(saved.accountNumberMasked).toBe('•••• 7890');
    expect((saved as any).accountNumber).toBeUndefined();

    const fetched = await wdRepo.getBankAccount(partnerId);
    expect(fetched).not.toBeNull();
    expect(fetched?.accountNumberMasked).toBe('•••• 7890');
    expect(fetched?.ifsc).toBe('HDFC0000123');
  });

  it('rejects withdrawal below minimum amount (min ₹500)', async () => {
    await wdRepo.saveBankAccount(partnerId, {
      holderName: 'Aditya Raj Singh',
      accountNumber: '50100234567890',
      ifsc: 'HDFC0000123',
    });

    await expect(
      wdRepo.createWithdrawal(partnerId, partnerName, { amount: 200 })
    ).rejects.toThrow(/Minimum withdrawal amount is ₹500/);
  });

  it('rejects withdrawal exceeding available balance', async () => {
    await wdRepo.saveBankAccount(partnerId, {
      holderName: 'Aditya Raj Singh',
      accountNumber: '50100234567890',
      ifsc: 'HDFC0000123',
    });

    // Commission available is 1,00,000; requesting 1,50,000
    await expect(
      wdRepo.createWithdrawal(partnerId, partnerName, { amount: 150000 })
    ).rejects.toThrow(/Insufficient available balance/);
  });

  it('creates withdrawal, deducts balance, and tracks history', async () => {
    const w1 = await wdRepo.createWithdrawal(partnerId, partnerName, {
      amount: 40000,
      holderName: 'Aditya Raj Singh',
      accountNumber: '50100234567890',
      ifsc: 'HDFC0000123',
      saveDetails: true,
    });

    expect(w1.status).toBe('requested');
    expect(w1.amount).toBe(40000);
    expect(w1.bankSnapshot.accountNumberMasked).toBe('•••• 7890');
    expect(w1.history).toHaveLength(1);

    // Remaining balance should now be 60,000
    const avail = await wdRepo.getPartnerAvailableBalance(partnerId);
    expect(avail).toBe(60000);

    // Second withdrawal within remaining balance succeeds
    const w2 = await wdRepo.createWithdrawal(partnerId, partnerName, {
      amount: 30000,
    });
    expect(w2.amount).toBe(30000);

    const avail2 = await wdRepo.getPartnerAvailableBalance(partnerId);
    expect(avail2).toBe(30000);
  });

  it('admin flow: mark processing -> mark paid with UTR', async () => {
    const w = await wdRepo.createWithdrawal(partnerId, partnerName, {
      amount: 25000,
      holderName: 'Aditya Raj Singh',
      accountNumber: '50100234567890',
      ifsc: 'HDFC0000123',
    });

    // 1. Mark processing
    const proc = await wdRepo.updateWithdrawalStatus(w.id, 'processing', {
      admin: 'Admin User',
    });
    expect(proc.status).toBe('processing');
    expect(proc.history).toHaveLength(2);

    // 2. Mark paid
    const paid = await wdRepo.updateWithdrawalStatus(w.id, 'paid', {
      utr: 'UTR99881122',
      admin: 'Admin User',
    });
    expect(paid.status).toBe('paid');
    expect(paid.utr).toBe('UTR99881122');
    expect(paid.history).toHaveLength(3);
  });

  it('admin flow: rejection returns amount to partner available balance', async () => {
    const w = await wdRepo.createWithdrawal(partnerId, partnerName, {
      amount: 50000,
      holderName: 'Aditya Raj Singh',
      accountNumber: '50100234567890',
      ifsc: 'HDFC0000123',
    });

    let avail = await wdRepo.getPartnerAvailableBalance(partnerId);
    expect(avail).toBe(50000); // 1,00,000 - 50,000

    // Reject withdrawal
    const rejected = await wdRepo.updateWithdrawalStatus(w.id, 'rejected', {
      rejectReason: 'Invalid IFSC account combination',
      admin: 'Admin User',
    });

    expect(rejected.status).toBe('rejected');
    expect(rejected.rejectReason).toBe('Invalid IFSC account combination');

    // Balance is returned!
    avail = await wdRepo.getPartnerAvailableBalance(partnerId);
    expect(avail).toBe(100000);
  });
});
