import express from "express";
import { Webhook } from "svix";

const router = express.Router();

// Clerk can POST user/org lifecycle events here if you want to react to
// them (e.g. cleanup on org deletion). Not required for the app to work,
// since we read req.auth.orgId / userId directly on each request, but the
// endpoint is wired up and verified for whenever you need it.
router.post("/clerk", express.raw({ type: "application/json" }), (req, res) => {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return res.status(501).json({ message: "Webhook secret not configured" });

  try {
    const wh = new Webhook(secret);
    const evt = wh.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    console.log("Clerk webhook received:", evt.type);
    // Add handling for evt.type (e.g. "organization.deleted") as needed.
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    res.status(400).json({ message: "Webhook verification failed" });
  }
});

export default router;
