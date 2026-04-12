import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import {
  getMe, updateProfile, changePassword,
  upgradePlan, useDiscount, redeemPoints, deleteAccount,
} from "../controllers/user.controller";

const router = Router();

router.use(authenticate, requireRole("user"));

router.get("/me", getMe);
router.patch("/me", updateProfile);
router.patch("/me/password", changePassword);
router.delete("/me", deleteAccount);
router.post("/me/upgrade", upgradePlan);
router.post("/me/use-discount", useDiscount);
router.post("/me/redeem", redeemPoints);

export default router;
