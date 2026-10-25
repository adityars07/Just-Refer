/**
 * Twilio Verify OTP Helper
 * Uses Twilio Verify API for SMS-based OTP authentication.
 * Handles sending OTP and verifying OTP codes.
 */

import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifySid) {
  console.error('[Twilio] ⚠️  Missing Twilio credentials in .env file');
}

const client = twilio(accountSid, authToken);

/**
 * Send OTP to a phone number via SMS
 * @param {string} phoneNumber - E.164 format phone number (e.g. +919876543210)
 * @returns {Promise<{success: boolean, status?: string, error?: string}>}
 */
export async function sendOTP(phoneNumber) {
  try {
    const formatted = formatPhoneNumber(phoneNumber);
    console.log(`[Twilio] Sending OTP to ${formatted}`);

    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({
        to: formatted,
        channel: 'sms',
      });

    console.log(`[Twilio] OTP sent successfully. Status: ${verification.status}`);
    return { success: true, status: verification.status };
  } catch (err) {
    console.error('[Twilio] Send OTP error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Verify OTP code entered by user
 * @param {string} phoneNumber - E.164 format phone number
 * @param {string} code - 6-digit OTP code
 * @returns {Promise<{success: boolean, status?: string, error?: string}>}
 */
export async function verifyOTP(phoneNumber, code) {
  try {
    const formatted = formatPhoneNumber(phoneNumber);
    console.log(`[Twilio] Verifying OTP for ${formatted}`);

    const verificationCheck = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({
        to: formatted,
        code: code,
      });

    const isApproved = verificationCheck.status === 'approved';
    console.log(`[Twilio] Verification status: ${verificationCheck.status}`);

    return {
      success: isApproved,
      status: verificationCheck.status,
      error: isApproved ? undefined : 'Invalid or expired OTP',
    };
  } catch (err) {
    console.error('[Twilio] Verify OTP error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Format Indian phone number to E.164 format
 * Handles: 9876543210, 09876543210, +919876543210, 919876543210
 */
function formatPhoneNumber(phone) {
  let cleaned = phone.replace(/[\s\-()]/g, '');

  // Already in E.164 format
  if (cleaned.startsWith('+91') && cleaned.length === 13) {
    return cleaned;
  }

  // Has country code without +
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // Has leading 0
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+91${cleaned.slice(1)}`;
  }

  // Just 10-digit number
  if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
    return `+91${cleaned}`;
  }

  // Fallback: prepend +91 if not already formatted
  if (!cleaned.startsWith('+')) {
    return `+91${cleaned}`;
  }

  return cleaned;
}
