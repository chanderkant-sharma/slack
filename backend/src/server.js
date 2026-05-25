import { sentryEnabled } from "../instrument.mjs";
import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { runMigrations } from "./config/migrate.js";
import authRoutes from "./routes/auth.route.js";
import chatRoutes from "./routes/chat.route.js";

import cors from "cors";

import * as Sentry from "@sentry/node";

const app = express();

const corsOrigin =
  ENV.NODE_ENV === "production"
    ? ENV.CLIENT_URL
    : (origin, callback) => {
        if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
          callback(null, true);
        } else {
          callback(null, ENV.CLIENT_URL);
        }
      };

app.use(express.json());
app.use(cors({ origin: corsOrigin, credentials: true }));

app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

app.get("/", (req, res) => {
  res.send("Hello World! 123");
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

if (sentryEnabled) {
  Sentry.setupExpressErrorHandler(app);
}

const startServer = async () => {
  try {
    await connectDB();
    await runMigrations();
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log("Server started on port:", ENV.PORT);
      });
    }
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
