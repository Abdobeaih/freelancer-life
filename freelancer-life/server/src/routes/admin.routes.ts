import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import {
  getStats, listUsers, setUserPlan,
  grantPoints, deleteUser, listCompanies,
} from "../controllers/admin.controller";

const router = Router();

router.use(authenticate, requireRole("admin"));

router.get("/stats", getStats);
router.get("/users", listUsers);
router.patch("/users/:id/plan", setUserPlan);
router.post("/users/:id/points", grantPoints);
router.delete("/users/:id", deleteUser);
router.get("/companies", listCompanies);

export default router;
