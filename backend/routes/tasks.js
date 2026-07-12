import express from "express";
import { requireSignedIn } from "../middleware/auth.js";
import { requireOrg } from "../middleware/requireOrg.js";
import { listTasks, getTask, createTask, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();
router.use(requireSignedIn, requireOrg);

router.get("/", listTasks);
router.post("/", createTask);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
