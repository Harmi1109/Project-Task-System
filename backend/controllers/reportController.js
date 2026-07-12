import { prisma } from "../lib/prisma.js";

// All reports are computed live from current data (no stored snapshots),
// so they're always accurate and there's nothing extra to keep in sync.

export const orgOverview = async (req, res) => {
  const orgId = req.auth.orgId;

  const [projectCount, teamCount, statusRaw, priorityRaw, overdueTasks] = await Promise.all([
    prisma.project.count({ where: { orgId } }),
    prisma.team.count({ where: { orgId } }),
    prisma.task.groupBy({ by: ["status"], where: { orgId }, _count: { status: true } }),
    prisma.task.groupBy({ by: ["priority"], where: { orgId }, _count: { priority: true } }),
    prisma.task.count({ where: { orgId, status: { not: "done" }, dueDate: { lt: new Date() } } }),
  ]);

  const taskStatusBreakdown = statusRaw.map((s) => ({ _id: s.status, count: s._count.status }));
  const tasksByPriority = priorityRaw.map((p) => ({ _id: p.priority, count: p._count.priority }));

  res.json({ projectCount, teamCount, taskStatusBreakdown, tasksByPriority, overdueTasks });
};

export const projectReport = async (req, res) => {
  const { id } = req.params;
  const project = await prisma.project.findFirst({ where: { id, orgId: req.auth.orgId } });
  if (!project) return res.status(404).json({ message: "Project not found" });

  const [statusRaw, assigneeRaw, total, completed] = await Promise.all([
    prisma.task.groupBy({ by: ["status"], where: { projectId: project.id }, _count: { status: true } }),
    prisma.task.groupBy({ by: ["assignee"], where: { projectId: project.id }, _count: { assignee: true } }),
    prisma.task.count({ where: { projectId: project.id } }),
    prisma.task.count({ where: { projectId: project.id, status: "done" } }),
  ]);

  const statusBreakdown = statusRaw.map((s) => ({ _id: s.status, count: s._count.status }));
  const byAssignee = assigneeRaw.map((a) => ({ _id: a.assignee, count: a._count.assignee }));
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json({
    project: { id: project.id, name: project.name },
    statusBreakdown,
    byAssignee,
    total,
    completed,
    completionRate,
  });
};

export const teamWorkload = async (req, res) => {
  const { id } = req.params;
  const team = await prisma.team.findFirst({
    where: { id, orgId: req.auth.orgId },
    include: { members: true },
  });
  if (!team) return res.status(404).json({ message: "Team not found" });

  const memberIds = team.members.map((m) => m.userId);
  const workloadRaw = await prisma.task.groupBy({
    by: ["assignee", "status"],
    where: { orgId: req.auth.orgId, assignee: { in: memberIds } },
    _count: { status: true },
  });
  const workload = workloadRaw.map((w) => ({
    _id: { assignee: w.assignee, status: w.status },
    count: w._count.status,
  }));

  res.json({ team: { id: team.id, name: team.name }, workload });
};
