import express from "express";
import { requireSignedIn } from "../middleware/auth.js";
import { requireOrg } from "../middleware/requireOrg.js";
import { listComments, createComment, deleteComment } from "../controllers/commentController.js";

const router = express.Router();
router.use(requireSignedIn, requireOrg);

router.get("/", listComments);
router.post("/", createComment);
router.delete("/:id", deleteComment);

export default router;
