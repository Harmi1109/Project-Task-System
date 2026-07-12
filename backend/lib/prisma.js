import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient instance (important with nodemon's hot
// reloads, otherwise you can exhaust MySQL connections quickly).
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
