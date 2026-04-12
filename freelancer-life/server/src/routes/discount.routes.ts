import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import {
  listDiscounts, adminListDiscounts,
  createDiscount, updateDiscount, deleteDiscount,
  submitDiscountRequest,
} from "../controllers/discount.controller";

const router = Router();

// Public
router.get("/", listDiscounts);

// Admin
router.get("/all", authenticate, requireRole("admin"), adminListDiscounts);
router.post("/", authenticate, requireRole("admin"), createDiscount);
router.patch("/:id", authenticate, requireRole("admin"), updateDiscount);
router.delete("/:id", authenticate, requireRole("admin"), deleteDiscount);

// Company
router.post("/request", authenticate, requireRole("company"), submitDiscountRequest);

export default router;
