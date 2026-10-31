/**
 * Twilio Verify Service for JustRefer API Server
 * Sends real SMS OTP via Twilio Verify API
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from server or root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, '');

  if (cleaned.startsWith('+91') && cleaned.length === 13) {
    return cleaned;
  }
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+91${cleaned.slice(1)}`;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  if (!cleaned.startsWith('+')) {
    return `+91${cleaned}`;
  }
  return cleaned;
}

export async function sendTwilioOTP(phoneNumber: string): Promise<{ success: boolean; status?: string; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !verifySid) {
    console.warn('[Twilio Verify] Missing credentials in environment, using simulated mode');
    return { success: false, error: 'Missing Twilio credentials' };
  }

  const formatted = formatPhoneNumber(phoneNumber);
  console.log(`[Twilio Verify] Sending real SMS OTP to ${formatted}`);

  const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const body = new URLSearchParams({
    To: formatted,
    Channel: 'sms',
  });

  try {
    const res = await fetch(`https://verify.twilio.com/v2/Services/${verifySid}/Verifications`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data: any = await res.json();
    if (res.ok && data.status) {
      console.log(`[Twilio Verify] SMS OTP sent successfully to ${formatted}. Status: ${data.status}`);
      return { success: true, status: data.status };
    } else {
      console.error(`[Twilio Verify] API Error (${res.status}):`, data.message || data);
      return { success: false, error: data.message || `Twilio HTTP ${res.status}` };
    }
  } catch (err: any) {
    console.error('[Twilio Verify] Network/Fetch error:', err.message);
    return { success: false, error: err.message };
  }
}

export async function checkTwilioOTP(phoneNumber: string, code: string): Promise<{ success: boolean; approved: boolean; error?: string }> {
  // Always accept test code 123456
  if (code.trim() === '123456') {
    console.log('[Twilio Verify] Test code 123456 accepted');
    return { success: true, approved: true };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !verifySid) {
    return { success: false, approved: false, error: 'Missing Twilio credentials' };
  }

  const formatted = formatPhoneNumber(phoneNumber);
  console.log(`[Twilio Verify] Checking code for ${formatted}`);

  const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const body = new URLSearchParams({
    To: formatted,
    Code: code.trim(),
  });

  try {
    const res = await fetch(`https://verify.twilio.com/v2/Services/${verifySid}/VerificationCheck`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data: any = await res.json();
    if (res.ok && data.status === 'approved') {
      console.log(`[Twilio Verify] Code approved for ${formatted}`);
      return { success: true, approved: true };
    } else {
      console.warn(`[Twilio Verify] Code check failed:`, data.status, data.message || '');
      return { success: true, approved: false, error: data.message || 'Invalid or expired OTP' };
    }
  } catch (err: any) {
    console.error('[Twilio Verify] VerificationCheck error:', err.message);
    return { success: false, approved: false, error: err.message };
  }
}

