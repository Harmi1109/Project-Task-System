import "dotenv/config";
console.log("DATABASE_URL is:", process.env.DATABASE_URL);

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";

import { prisma } from "./lib/prisma.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import teamRoutes from "./routes/teams.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";
import documentRoutes from "./routes/documents.js";
import commentRoutes from "./routes/comments.js";
import notificationRoutes from "./routes/notifications.js";
import reportRoutes from "./routes/reports.js";
import webhookRoutes from "./routes/webhooks.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));

app.use("/api/webhooks", webhookRoutes);

app.use(express.json());

// CLERK
app.use(clerkMiddleware());

// Root route — avoids "Not found - /" noise from health checks / browser hits
app.get("/", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);

// FALLBACK ERROR HANDLING MIDDLEWARE PIPELINES
app.use(notFound);
app.use(errorHandler);

try {
  await prisma.$connect();
  console.log("MySQL database cluster connected cleanly via Prisma Client.");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server engine initialized successfully on port ${PORT}`);
  });
} catch (err) {
  console.error("Critical database connection abort:", err.message);
  process.exit(1);
}