/**
 * Generates a referral code derived from the user's name.
 * Example:
 *   "Aditya Raj Singh" -> "JR-ADIT4821"
 *   "Ayush Shrivastava" -> "JR-AYUS7175"
 *   "Priya"             -> "JR-PRIY2938"
 *   "Ali"               -> "JR-ALIX6412"
 */
export function generateReferralCode(name?: string): string {
  const clean = (name || 'JR')
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 4)
    .toUpperCase()
    .padEnd(4, 'X');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `JR-${clean}${rand}`;
}

