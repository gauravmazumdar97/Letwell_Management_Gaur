import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config.js";
import { errorHandler } from "./middleware/error-handler.js";
import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";
import { propertiesRouter } from "./routes/properties.js";
import { meRouter } from "./routes/me.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.use("/api", healthRouter);
  app.use("/api", authRouter);
  app.use("/api", propertiesRouter);
  app.use("/api", meRouter);

  app.use(errorHandler);
  return app;
}
