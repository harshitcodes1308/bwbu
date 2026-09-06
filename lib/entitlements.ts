// MGNREGA §3(1): if work is not provided within 15 days of a valid demand, the
// worker is owed an unemployment allowance — not less than 1/4 of the wage rate
// for the first 30 days of the financial year, and not less than 1/2 thereafter
// (§7). These are synthetic demo figures, not an official entitlement statement.
export const STATUTORY_DAYS = 15;

export function unemploymentAllowance(daysWaiting: number, rate: number) {
  const eligibleDays = Math.max(0, daysWaiting - STATUTORY_DAYS);
  const tier1 = Math.min(eligibleDays, 30) * rate * 0.25;
  const tier2 = Math.max(0, eligibleDays - 30) * rate * 0.5;
  return { eligibleDays, eligible: eligibleDays > 0, amount: Math.round(tier1 + tier2) };
}

// Whole days elapsed since an ISO date, floored (18d 18h is still "18 days").
export function daysSince(isoDate: string, today: Date) {
  if (!isoDate) return 0;
  return Math.max(0, Math.floor((today.getTime() - new Date(`${isoDate}T00:00:00`).getTime()) / 86400000));
}
