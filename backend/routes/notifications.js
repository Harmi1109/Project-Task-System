import express from "express";
import { requireSignedIn } from "../middleware/auth.js";
import { requireOrg } from "../middleware/requireOrg.js";
import {
  listNotifications,
  markRead,
  markAllRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();
router.use(requireSignedIn, requireOrg);

router.get("/", listNotifications);
router.put("/read-all", markAllRead);
router.put("/:id/read", markRead);
router.delete("/:id", deleteNotification);

export default router;
