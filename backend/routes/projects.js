import express from "express";
import { requireSignedIn } from "../middleware/auth.js";
import { requireOrg } from "../middleware/requireOrg.js";
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();
router.use(requireSignedIn, requireOrg);

router.get("/", listProjects);
router.post("/", createProject);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
