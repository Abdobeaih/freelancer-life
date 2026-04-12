import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { getCompany, updateCompany, listAllRewards } from "../controllers/company.controller";

const router = Router();

// Authenticated user can fetch rewards
router.get("/rewards", authenticate, listAllRewards);

// Company-only
router.get("/me", authenticate, requireRole("company"), getCompany);
router.patch("/me", authenticate, requireRole("company"), updateCompany);

export default router;
