/**
 * Free Razorpay IFSC Lookup API
 * Validates format /^[A-Z]{4}0[A-Z0-9]{6}$/
 * Skips quietly if lookup fails or goes offline
 */
export async function lookupIFSC(code: string): Promise<{
  valid: boolean;
  bank?: string;
  branch?: string;
  city?: string;
  bankName?: string;
}> {
  const trimmed = code.trim().toUpperCase();
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(trimmed)) {
    return { valid: false };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://ifsc.razorpay.com/${trimmed}`, {
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      return { valid: false };
    }

    const data = (await res.json()) as any;
    const bank = (data.BANK || '').trim();
    const branch = (data.BRANCH || '').trim();
    const city = (data.CITY || '').trim();

    const parts = [bank];
    if (branch) parts.push(branch);
    if (city && !branch.toLowerCase().includes(city.toLowerCase())) {
      parts.push(city);
    }
    const bankName = parts.filter(Boolean).join(' • ');

    return {
      valid: true,
      bank,
      branch,
      city,
      bankName: bankName || bank || 'Verified Bank',
    };
  } catch {
    // Skip quietly if fails or offline
    return { valid: false };
  }
}

