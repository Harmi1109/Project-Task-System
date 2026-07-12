import { prisma } from "../lib/prisma.js";

/**
 * Create a notification for a recipient. Awaited here so errors are at
 * least logged, but callers can fire-and-forget it themselves if desired.
 */
export const notify = async ({ orgId, recipient, type, message, link = "", triggeredBy = null }) => {
  if (!recipient) return null;
  try {
    return await prisma.notification.create({
      data: { orgId, recipient, type, message, link, triggeredBy },
    });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
    return null;
  }
};
