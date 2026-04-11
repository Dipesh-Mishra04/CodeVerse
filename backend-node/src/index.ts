import { config } from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { topicsRouter } from "./routes/topics.js";
import { questionsRouter } from "./routes/questions.js";
import { languagesRouter } from "./routes/languages.js";
import { analyticsRouter } from "./routes/analytics.js";
import { leaderboardRouter } from "./routes/leaderboard.js";
import { profileRouter } from "./routes/profile.js";
import { executeRouter } from "./routes/execute.js";
import { tutorRouter } from "./routes/tutor.js";

config();

const app = express();
const port = Number(process.env.PORT) || 4001;

const origins = (process.env.FRONTEND_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: origins.length ? origins : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

const limiter = rateLimit({
  windowMs: 60_000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "codeverse-backend-node" });
});

app.use("/api/topics", topicsRouter);
app.use("/api/languages", languagesRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/profile", profileRouter);
app.use("/api/execute", executeRouter);
app.use("/api/tutor", tutorRouter);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: err.message ?? "Internal error" });
  }
);

app.listen(port, () => {
  console.log(`CodeVerse API listening on http://127.0.0.1:${port}`);
});
