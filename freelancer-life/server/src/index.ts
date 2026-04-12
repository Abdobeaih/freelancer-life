import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes     from "./routes/auth.routes";
import userRoutes     from "./routes/user.routes";
import discountRoutes from "./routes/discount.routes";
import adminRoutes    from "./routes/admin.routes";
import companyRoutes  from "./routes/company.routes";
import { errorHandler } from "./middleware/errorHandler";

const app  = express();
const PORT = process.env.PORT ?? 4000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL ?? "http://localhost:5173", credentials: true }));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/users",     userRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/admin",     adminRoutes);
app.use("/api/companies", companyRoutes);

// ── Health ───────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ── Error handler ────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
