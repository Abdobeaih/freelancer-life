import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";
import { Category, Plan, Status } from "@prisma/client";

const discountSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  category: z.nativeEnum(Category),
  percentage: z.string(),
  city: z.string().min(2),
  tier: z.nativeEnum(Plan).default(Plan.free),
});

// ── List (public) ────────────────────────────────────────────
export const listDiscounts = async (req: Request, res: Response) => {
  const { cat, tier, q } = req.query;
  const discounts = await prisma.discount.findMany({
    where: {
      status: Status.approved,
      ...(cat && cat !== "all" ? { category: cat as Category } : {}),
      ...(tier && tier !== "all" ? { tier: tier as Plan } : {}),
      ...(q ? { OR: [{ name: { contains: q as string } }, { description: { contains: q as string } }, { city: { contains: q as string } }] } : {}),
    },
    include: { company: { select: { id: true, name: true, emoji: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(discounts);
};

// ── Admin: list all ──────────────────────────────────────────
export const adminListDiscounts = async (_req: Request, res: Response) => {
  const discounts = await prisma.discount.findMany({
    include: { company: { select: { id: true, name: true, emoji: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(discounts);
};

// ── Admin: create ────────────────────────────────────────────
export const createDiscount = async (req: AuthRequest, res: Response) => {
  const data = discountSchema.parse(req.body);
  const { companyId } = req.body;
  const discount = await prisma.discount.create({
    data: { ...data, status: Status.approved, companyId: companyId || null },
    include: { company: { select: { id: true, name: true, emoji: true } } },
  });
  res.status(201).json(discount);
};

// ── Admin: update ────────────────────────────────────────────
export const updateDiscount = async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id);
  const data = discountSchema.partial().parse(req.body);
  const { status } = req.body;
  const discount = await prisma.discount.update({
    where: { id },
    data: { ...data, ...(status ? { status } : {}) },
    include: { company: { select: { id: true, name: true, emoji: true } } },
  });
  res.json(discount);
};

// ── Admin: delete ────────────────────────────────────────────
export const deleteDiscount = async (req: AuthRequest, res: Response) => {
  await prisma.discount.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: "Deleted" });
};

// ── Company: submit request ──────────────────────────────────
export const submitDiscountRequest = async (req: AuthRequest, res: Response) => {
  const data = discountSchema.parse(req.body);
  const discount = await prisma.discount.create({
    data: { ...data, status: Status.pending, companyId: req.user!.id },
    include: { company: { select: { id: true, name: true, emoji: true } } },
  });
  res.status(201).json(discount);
};
