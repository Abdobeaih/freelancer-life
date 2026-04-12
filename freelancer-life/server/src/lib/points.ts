export const PTS = {
  SIGNUP: 100,
  REFERRAL_SENDER: 200,
  REFERRAL_RECEIVER: 100,
  USE_DISC_FREE: 10,
  USE_DISC_PREM: 20,
  USE_DISC_ELITE: 30,
  UPGRADE_PREMIUM: 150,
  UPGRADE_ELITE: 300,
} as const;

export const genReferralCode = (name: string): string =>
  "FL-" +
  name
    .toUpperCase()
    .replace(/\s/g, "")
    .slice(0, 6) +
  Math.floor(Math.random() * 900 + 100);
