import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

// ── Get company profile ──────────────────────────────────────
export const getCompany = async (req: AuthRequest, res: Response) => {
  const company = await prisma.company.findUnique({
    where: { id: req.user!.id },
    include: {
      discounts: { include: { company: { select: { name: true, emoji: true } } } },
      ptRewards: true,
    },
  });
  if (!company) { res.status(404).json({ error: "Not found" }); return; }
  res.json(company);
};

// ── Update company ───────────────────────────────────────────
export const updateCompany = async (req: AuthRequest, res: Response) => {
  const { name, city } = z.object({ name: z.string().min(2), city: z.string().min(2) }).parse(req.body);
  const company = await prisma.company.update({
    where: { id: req.user!.id },
    data: { name, city },
    include: { discounts: true, ptRewards: true },
  });
  res.json(company);
};

// ── Get public rewards (for users to redeem) ─────────────────
export const listAllRewards = async (_req: AuthRequest, res: Response) => {
  const rewards = await prisma.ptReward.findMany({
    where: { active: true, company: { status: "approved" } },
    include: { company: { select: { id: true, name: true, emoji: true, city: true } } },
    orderBy: { points: "asc" },
  });
  res.json(rewards);
};
