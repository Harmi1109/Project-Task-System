import express from "express";
import { requireSignedIn } from "../middleware/auth.js";
import { requireOrg } from "../middleware/requireOrg.js";
import {
  listDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../controllers/documentController.js";

const router = express.Router();
router.use(requireSignedIn, requireOrg);

router.get("/", listDocuments);
router.post("/", createDocument);
router.get("/:id", getDocument);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;
