export type Plan       = "free" | "premium" | "elite";
export type Role       = "user" | "admin" | "company";
export type Category   = "gym" | "food" | "medical" | "fun";
export type Status     = "pending" | "approved" | "rejected";
export type TxType     = "earn" | "spend" | "bonus";

export interface Card {
  id:         string;
  nameOnCard: string;
  lastFour:   string;
  expiry:     string;
}

export interface PointTx {
  id:        string;
  type:      TxType;
  points:    number;
  desc:      string;
  icon:      string;
  createdAt: string;
}

export interface Referral {
  id:        string;
  name:      string;
  job:       string;
  createdAt: string;
}

export interface User {
  id:           string;
  name:         string;
  email:        string;
  job:          string;
  plan:         Plan;
  points:       number;
  pointsSpent:  number;
  scans:        number;
  saved:        number;
  referralCode: string;
  referredById: string | null;
  createdAt:    string;
  card:         Card | null;
  transactions: PointTx[];
  referrals:    Referral[];
}

export interface PtReward {
  id:            string;
  description:   string;
  points:        number;
  active:        boolean;
  redeemedCount: number;
  companyId:     string;
  company:       { id: string; name: string; emoji: string; city: string };
}

export interface Company {
  id:        string;
  name:      string;
  email:     string;
  category:  Category;
  city:      string;
  emoji:     string;
  status:    Status;
  views:     number;
  createdAt: string;
  discounts?: Discount[];
  ptRewards?: PtReward[];
}

export interface Discount {
  id:          number;
  name:        string;
  description: string;
  category:    Category;
  percentage:  string;
  city:        string;
  tier:        Plan;
  status:      Status;
  uses:        number;
  views:       number;
  companyId:   string | null;
  company:     { id: string; name: string; emoji: string } | null;
  createdAt:   string;
}

export interface AdminStats {
  users:            number;
  premium:          number;
  elite:            number;
  revenue:          number;
  totalPts:         number;
  totalPtSpent:     number;
  totalRefs:        number;
  pendingDiscounts: number;
  approvedDiscounts:number;
  companies:        number;
  monthlyGrowth:    number[];
}

export interface AuthState {
  token:   string | null;
  role:    Role | null;
  user:    User | null;
  company: Company | null;
}
