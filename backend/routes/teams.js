import express from "express";
import { requireSignedIn } from "../middleware/auth.js";
import { requireOrg } from "../middleware/requireOrg.js";
import {
  listTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
} from "../controllers/teamController.js";

const router = express.Router();
router.use(requireSignedIn, requireOrg);

router.get("/", listTeams);
router.post("/", createTeam);
router.get("/:id", getTeam);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);
router.post("/:id/members", addMember);
router.delete("/:id/members/:userId", removeMember);

export default router;
