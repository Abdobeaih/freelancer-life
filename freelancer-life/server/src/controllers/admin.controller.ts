import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { PTS } from "../lib/points";
import { Plan } from "@prisma/client";

// ── Dashboard stats ──────────────────────────────────────────
export const getStats = async (_req: Request, res: Response) => {
  const [users, discounts, companies] = await Promise.all([
    prisma.user.findMany({ select: { plan: true, points: true, pointsSpent: true, createdAt: true, referrals: { select: { id: true } } } }),
    prisma.discount.findMany({ select: { status: true, uses: true, name: true, id: true } }),
    prisma.company.findMany({ select: { id: true, name: true, status: true } }),
  ]);

  const premium = users.filter((u) => u.plan === "premium").length;
  const elite   = users.filter((u) => u.plan === "elite").length;
  const revenue = premium * 49 + elite * 99;
  const totalPts = users.reduce((a, u) => a + u.points, 0);
  const totalPtSpent = users.reduce((a, u) => a + u.pointsSpent, 0);
  const totalRefs = users.reduce((a, u) => a + u.referrals.length, 0);

  const monthlyGrowth = Array.from({ length: 12 }, (_, i) =>
    users.filter((u) => new Date(u.createdAt).getMonth() === i).length
  );

  res.json({
    users: users.length,
    premium,
    elite,
    revenue,
    totalPts,
    totalPtSpent,
    totalRefs,
    pendingDiscounts: discounts.filter((d) => d.status === "pending").length,
    approvedDiscounts: discounts.filter((d) => d.status === "approved").length,
    companies: companies.length,
    monthlyGrowth,
  });
};

// ── List users ───────────────────────────────────────────────
export const listUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: {
      card: true,
      referrals: { select: { id: true } },
      transactions: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
};

// ── Set user plan ────────────────────────────────────────────
export const setUserPlan = async (req: Request, res: Response) => {
  const { plan } = z.object({ plan: z.nativeEnum(Plan) }).parse(req.body);
  const bonus =
    plan === "elite" ? PTS.UPGRADE_ELITE : plan === "premium" ? PTS.UPGRADE_PREMIUM : 0;

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      plan,
      ...(bonus > 0
        ? {
            points: { increment: bonus },
            transactions: {
              create: { type: "bonus", points: bonus, desc: `ترقية من المدير إلى ${plan}`, icon: "crown" },
            },
          }
        : {}),
    },
    include: { card: true, transactions: { orderBy: { createdAt: "asc" } } },
  });
  res.json(user);
};

// ── Grant points ─────────────────────────────────────────────
export const grantPoints = async (req: Request, res: Response) => {
  const { points } = z.object({ points: z.number().positive() }).parse(req.body);
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      points: { increment: points },
      transactions: {
        create: { type: "bonus", points, desc: "نقاط مُضافة من الإدارة", icon: "sparkles" },
      },
    },
    include: { card: true, transactions: { orderBy: { createdAt: "asc" } } },
  });
  res.json(user);
};

// ── Delete user ──────────────────────────────────────────────
export const deleteUser = async (req: Request, res: Response) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};

// ── List companies ───────────────────────────────────────────
export const listCompanies = async (_req: Request, res: Response) => {
  const companies = await prisma.company.findMany({
    include: { discounts: true, ptRewards: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(companies);
};
