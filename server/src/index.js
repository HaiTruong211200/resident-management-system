const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { initSupabase } = require("./config/db");
const { router: authRoutes } = require("./routes/auth");
const { auth } = require("./middleware/auth");
const residentsRoutes = require("./routes/residents");
const householdsRoutes = require("./routes/households");
const paymentTypesRoutes = require("./routes/paymentTypes");
const householdPaymentsRoutes = require("./routes/householdPayments");

const app = express();

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

(async () => {
  try {
    // Initialize Supabase client
    initSupabase(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
    );
  } catch (err) {
    console.error("Supabase init failed:", err);
    process.exit(1);
  }

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: "10kb" }));
  app.use(morgan("dev"));

  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
  app.use("/api/", limiter);
  app.use("/auth", limiter);

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  // Auth routes (single canonical mount)
  app.use("/api/auth", authRoutes);

  // Resource routes
  app.use("/api/residents", residentsRoutes);
  app.use("/api/households", householdsRoutes);
  // ERD-aligned routes replacing previous fees feature
  app.use("/api/payment-types", paymentTypesRoutes);
  app.use("/api/household-payments", householdPaymentsRoutes);

  // Protected route
  app.get("/api/me", auth, (req, res) => {
    const { sendSuccess } = require("./utils/response");
    return sendSuccess(res, { account: req.account });
  });

  const { sendError } = require("./utils/response");
  // 404 handler
  app.use((req, res) =>
    sendError(res, { status: 404, message: "Not found", code: "NOT_FOUND" })
  );

  // Central error handler
  app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    if (res.headersSent) return;
    sendError(res);
  });

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
})();
