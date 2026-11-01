import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

function getEncryptionKey(): Buffer {
  const envKey = process.env.BANK_ENC_KEY || 'justrefer_secure_bank_enc_key_32_bytes_2026';
  return crypto.createHash('sha256').update(envKey).digest();
}

/**
 * Encrypts an account number using AES-256-GCM.
 * Never logs or prints the plaintext account number.
 */
export function encryptAccountNumber(accountNumber: string): string {
  const clean = accountNumber.replace(/\s+/g, '');
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(clean, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts an encrypted account number using AES-256-GCM.
 */
export function decryptAccountNumber(encryptedString: string): string {
  const parts = encryptedString.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted account number format');
  }
  const [ivHex, tagHex, dataHex] = parts;
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const encrypted = Buffer.from(dataHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

/**
 * Formats account number as masked representation, e.g. "•••• 7890"
 */
export function maskAccountNumber(accountNumber: string): string {
  const clean = accountNumber.replace(/\s+/g, '');
  const last4 = clean.slice(-4);
  return `•••• ${last4}`;
}

