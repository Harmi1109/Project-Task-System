import { prisma } from "../lib/prisma.js";
import { notify } from "../utils/notify.js";

export const listTasks = async (req, res) => {
  const { project, status, assignee, priority } = req.query;
  const where = { orgId: req.auth.orgId };
  if (project) where.projectId = project;
  if (status) where.status = status;
  if (assignee) where.assignee = assignee;
  if (priority) where.priority = priority;

  const tasks = await prisma.task.findMany({ where, orderBy: { createdAt: "desc" } });
  res.json(tasks);
};

export const getTask = async (req, res) => {
  const task = await prisma.task.findFirst({ where: { id: req.params.id, orgId: req.auth.orgId } });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

export const createTask = async (req, res) => {
  const { project, title, description, status, priority, assignee, dueDate, tags } = req.body;
  if (!project || !title) {
    return res.status(400).json({ message: "project and title are required" });
  }

  const projectDoc = await prisma.project.findFirst({ where: { id: project, orgId: req.auth.orgId } });
  if (!projectDoc) return res.status(404).json({ message: "Project not found" });

  const task = await prisma.task.create({
    data: {
      orgId: req.auth.orgId,
      projectId: project,
      title,
      description,
      status,
      priority,
      assignee: assignee || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      tags,
      createdBy: req.auth.userId,
    },
  });

  if (assignee && assignee !== req.auth.userId) {
    await notify({
      orgId: req.auth.orgId,
      recipient: assignee,
      type: "task_assigned",
      message: `You were assigned to task "${task.title}"`,
      link: `/projects/${project}`,
      triggeredBy: req.auth.userId,
    });
  }

  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const existing = await prisma.task.findFirst({ where: { id: req.params.id, orgId: req.auth.orgId } });
  if (!existing) return res.status(404).json({ message: "Task not found" });

  const updates = { ...req.body };
  delete updates.orgId;
  delete updates.createdBy;
  delete updates.project;
  delete updates.projectId;
  if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);

  const statusChanged = updates.status && updates.status !== existing.status;
  const reassigned = updates.assignee && updates.assignee !== existing.assignee;

  const task = await prisma.task.update({ where: { id: req.params.id }, data: updates });

  if (statusChanged && task.assignee && task.assignee !== req.auth.userId) {
    await notify({
      orgId: req.auth.orgId,
      recipient: task.assignee,
      type: "task_status_changed",
      message: `Task "${task.title}" moved to ${task.status.replace("_", " ")}`,
      link: `/projects/${task.projectId}`,
      triggeredBy: req.auth.userId,
    });
  }

  if (reassigned && task.assignee !== req.auth.userId) {
    await notify({
      orgId: req.auth.orgId,
      recipient: task.assignee,
      type: "task_assigned",
      message: `You were assigned to task "${task.title}"`,
      link: `/projects/${task.projectId}`,
      triggeredBy: req.auth.userId,
    });
  }

  res.json(task);
};

export const deleteTask = async (req, res) => {
  const existing = await prisma.task.findFirst({ where: { id: req.params.id, orgId: req.auth.orgId } });
  if (!existing) return res.status(404).json({ message: "Task not found" });

  await prisma.task.delete({ where: { id: req.params.id } });
  res.json({ message: "Task deleted" });
};
