import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { PTS, genReferralCode } from "../lib/points";
import { Plan } from "@prisma/client";

// ── Schemas ──────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(["user", "admin", "company"]),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  job: z.string().min(1),
  plan: z.enum(["free", "premium", "elite"]).default("free"),
  referralCode: z.string().optional(),
  card: z
    .object({ nameOnCard: z.string(), lastFour: z.string(), expiry: z.string() })
    .optional()
    .nullable(),
});

// ── Login ────────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  const { email, password, role } = loginSchema.parse(req.body);

  if (role === "admin") {
    const admin = await prisma.admin.findUnique({ where: { username: email } });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
      return;
    }
    const token = signToken({ id: admin.id, role: "admin" });
    res.json({ token, role: "admin", user: { id: admin.id, name: "Adham" } });
    return;
  }

  if (role === "company") {
    const company = await prisma.company.findUnique({ where: { email } });
    if (!company || !(await bcrypt.compare(password, company.passwordHash))) {
      res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
      return;
    }
    const token = signToken({ id: company.id, role: "company" });
    res.json({ token, role: "company", company: sanitizeCompany(company) });
    return;
  }

  // user
  const user = await prisma.user.findUnique({
    where: { email },
    include: { card: true, transactions: { orderBy: { createdAt: "asc" } } },
  });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    return;
  }
  const token = signToken({ id: user.id, role: "user" });
  res.json({ token, role: "user", user: sanitizeUser(user) });
};

// ── Register ─────────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  const body = registerSchema.parse(req.body);

  const exists = await prisma.user.findUnique({ where: { email: body.email } });
  if (exists) {
    res.status(409).json({ error: "البريد الإلكتروني مسجل مسبقًا" });
    return;
  }

  // Find referrer if code provided
  let referrer = body.referralCode
    ? await prisma.user.findUnique({ where: { referralCode: body.referralCode.toUpperCase() } })
    : null;

  const passwordHash = await bcrypt.hash(body.password, 10);
  const referralCode = genReferralCode(body.name);

  // Calculate initial points
  const signupBonus = PTS.SIGNUP;
  const planBonus =
    body.plan === "elite" ? PTS.UPGRADE_ELITE : body.plan === "premium" ? PTS.UPGRADE_PREMIUM : 0;
  const referralBonus = referrer ? PTS.REFERRAL_RECEIVER : 0;
  const totalPoints = signupBonus + planBonus + referralBonus;

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash,
      job: body.job,
      plan: body.plan as Plan,
      points: totalPoints,
      referralCode,
      referredById: referrer?.id ?? null,
      transactions: {
        create: [
          { type: "bonus", points: signupBonus, desc: "مكافأة ترحيبية 🎉", icon: "sparkles" },
          ...(planBonus > 0
            ? [{ type: "bonus" as const, points: planBonus, desc: `مكافأة اشتراك`, icon: "crown" }]
            : []),
          ...(referralBonus > 0 && referrer
            ? [{ type: "bonus" as const, points: referralBonus, desc: `مكافأة دعوة من ${referrer.name}`, icon: "gift" }]
            : []),
        ],
      },
      ...(body.card
        ? {
            card: {
              create: {
                nameOnCard: body.card.nameOnCard,
                lastFour: body.card.lastFour,
                expiry: body.card.expiry,
              },
            },
          }
        : {}),
    },
    include: { card: true, transactions: true },
  });

  // Reward referrer
  if (referrer) {
    await prisma.user.update({
      where: { id: referrer.id },
      data: {
        points: { increment: PTS.REFERRAL_SENDER },
        transactions: {
          create: {
            type: "bonus",
            points: PTS.REFERRAL_SENDER,
            desc: `إحالة ناجحة — ${body.name} انضم بدعوتك`,
            icon: "userPlus",
          },
        },
      },
    });
  }

  const token = signToken({ id: user.id, role: "user" });
  res.status(201).json({ token, role: "user", user: sanitizeUser(user) });
};

// ── Sanitizers ───────────────────────────────────────────────
const sanitizeUser = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  job: user.job,
  plan: user.plan,
  points: user.points,
  pointsSpent: user.pointsSpent,
  scans: user.scans,
  saved: user.saved,
  referralCode: user.referralCode,
  referredById: user.referredById,
  createdAt: user.createdAt,
  card: user.card ?? null,
  transactions: user.transactions ?? [],
});

const sanitizeCompany = (co: any) => ({
  id: co.id,
  name: co.name,
  email: co.email,
  category: co.category,
  city: co.city,
  emoji: co.emoji,
  status: co.status,
  views: co.views,
  createdAt: co.createdAt,
});
