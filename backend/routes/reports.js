import express from "express";
import { requireSignedIn } from "../middleware/auth.js";
import { requireOrg } from "../middleware/requireOrg.js";
import { orgOverview, projectReport, teamWorkload } from "../controllers/reportController.js";

const router = express.Router();
router.use(requireSignedIn, requireOrg);

router.get("/overview", orgOverview);
router.get("/projects/:id", projectReport);
router.get("/teams/:id/workload", teamWorkload);

export default router;
