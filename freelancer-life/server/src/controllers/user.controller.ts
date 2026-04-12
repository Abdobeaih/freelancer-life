import { Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { PTS } from "../lib/points";
import { AuthRequest } from "../middleware/auth";
import { Plan } from "@prisma/client";

// ── Get current user ─────────────────────────────────────────
export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      card: true,
      transactions: { orderBy: { createdAt: "asc" } },
      referrals: { select: { id: true, name: true, job: true, createdAt: true } },
    },
  });
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json(user);
};

// ── Update profile ───────────────────────────────────────────
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { name, job } = z.object({ name: z.string().min(2), job: z.string().min(1) }).parse(req.body);
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, job },
    include: { card: true, transactions: { orderBy: { createdAt: "asc" } } },
  });
  res.json(user);
};

// ── Change password ──────────────────────────────────────────
export const changePassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(6),
  }).parse(req.body);

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    res.status(400).json({ error: "كلمة المرور الحالية غير صحيحة" }); return;
  }
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 10) },
  });
  res.json({ message: "Password updated" });
};

// ── Upgrade plan ─────────────────────────────────────────────
export const upgradePlan = async (req: AuthRequest, res: Response) => {
  const { plan, card } = z.object({
    plan: z.enum(["premium", "elite"]),
    card: z.object({ nameOnCard: z.string(), lastFour: z.string(), expiry: z.string() }),
  }).parse(req.body);

  const bonus = plan === "elite" ? PTS.UPGRADE_ELITE : PTS.UPGRADE_PREMIUM;

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      plan: plan as Plan,
      points: { increment: bonus },
      card: {
        upsert: {
          create: card,
          update: card,
        },
      },
      transactions: {
        create: {
          type: "bonus",
          points: bonus,
          desc: `ترقية إلى ${plan}`,
          icon: "crown",
        },
      },
    },
    include: { card: true, transactions: { orderBy: { createdAt: "asc" } } },
  });
  res.json(user);
};

// ── Use discount ─────────────────────────────────────────────
export const useDiscount = async (req: AuthRequest, res: Response) => {
  const { discountId } = z.object({ discountId: z.number() }).parse(req.body);

  const [user, discount] = await Promise.all([
    prisma.user.findUnique({ where: { id: req.user!.id } }),
    prisma.discount.findUnique({ where: { id: discountId } }),
  ]);

  if (!user || !discount) { res.status(404).json({ error: "Not found" }); return; }

  const planOrder = { free: 0, premium: 1, elite: 2 };
  if (planOrder[user.plan] < planOrder[discount.tier]) {
    res.status(403).json({ error: "Insufficient plan" }); return;
  }

  const earnPts = { free: PTS.USE_DISC_FREE, premium: PTS.USE_DISC_PREM, elite: PTS.USE_DISC_ELITE }[user.plan];
  const saved = Math.floor(Math.random() * 60 * (parseFloat(discount.percentage) / 100) * 10) / 10;

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        scans: { increment: 1 },
        saved: { increment: saved },
        points: { increment: earnPts },
        transactions: {
          create: { type: "earn", points: earnPts, desc: `خصم ${discount.percentage} في ${discount.name}`, icon: "pct" },
        },
      },
      include: { card: true, transactions: { orderBy: { createdAt: "asc" } } },
    }),
    prisma.discount.update({ where: { id: discountId }, data: { uses: { increment: 1 } } }),
  ]);

  res.json({ user: updatedUser, saved, pointsEarned: earnPts });
};

// ── Redeem points ────────────────────────────────────────────
export const redeemPoints = async (req: AuthRequest, res: Response) => {
  const { rewardId } = z.object({ rewardId: z.string() }).parse(req.body);

  const [user, reward] = await Promise.all([
    prisma.user.findUnique({ where: { id: req.user!.id } }),
    prisma.ptReward.findUnique({ where: { id: rewardId }, include: { company: true } }),
  ]);

  if (!user || !reward) { res.status(404).json({ error: "Not found" }); return; }
  if (user.points < reward.points) { res.status(400).json({ error: "نقاطك غير كافية" }); return; }

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        points: { decrement: reward.points },
        pointsSpent: { increment: reward.points },
        transactions: {
          create: { type: "spend", points: reward.points, desc: `صرف نقاط: ${reward.description}`, icon: "coins" },
        },
      },
      include: { card: true, transactions: { orderBy: { createdAt: "asc" } } },
    }),
    prisma.ptReward.update({ where: { id: rewardId }, data: { redeemedCount: { increment: 1 } } }),
  ]);

  res.json(updatedUser);
};

// ── Delete account ───────────────────────────────────────────
export const deleteAccount = async (req: AuthRequest, res: Response) => {
  await prisma.user.delete({ where: { id: req.user!.id } });
  res.json({ message: "Account deleted" });
};
