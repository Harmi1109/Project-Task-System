import { prisma } from "../lib/prisma.js";
import { notify } from "../utils/notify.js";

const shapeProject = (project) => ({
  ...project,
  members: project.members?.map((m) => m.userId) || [],
});

export const listProjects = async (req, res) => {
  const { status, team } = req.query;
  const where = { orgId: req.auth.orgId };
  if (status) where.status = status;
  if (team) where.teamId = team;

  const projects = await prisma.project.findMany({
    where,
    include: { team: { select: { id: true, name: true } }, members: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(projects.map(shapeProject));
};

export const getProject = async (req, res) => {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, orgId: req.auth.orgId },
    include: {
      team: { include: { members: true } },
      members: true,
    },
  });
  if (!project) return res.status(404).json({ message: "Project not found" });

  const taskStatsRaw = await prisma.task.groupBy({
    by: ["status"],
    where: { projectId: project.id },
    _count: { status: true },
  });
  const taskStats = taskStatsRaw.map((s) => ({ _id: s.status, count: s._count.status }));

  res.json({ ...shapeProject(project), taskStats });
};

export const createProject = async (req, res) => {
  const { name, description, team, status, priority, startDate, dueDate, members = [] } = req.body;
  if (!name) return res.status(400).json({ message: "Project name is required" });

  const memberIds = Array.from(new Set([...members, req.auth.userId]));

  const project = await prisma.project.create({
    data: {
      orgId: req.auth.orgId,
      name,
      description,
      teamId: team || null,
      status,
      priority,
      startDate: startDate ? new Date(startDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdBy: req.auth.userId,
      members: { create: memberIds.map((userId) => ({ userId })) },
    },
    include: { team: { select: { id: true, name: true } }, members: true },
  });

  await Promise.all(
    memberIds
      .filter((m) => m !== req.auth.userId)
      .map((m) =>
        notify({
          orgId: req.auth.orgId,
          recipient: m,
          type: "project_added",
          message: `You were added to project "${project.name}"`,
          link: `/projects/${project.id}`,
          triggeredBy: req.auth.userId,
        })
      )
  );

  res.status(201).json(shapeProject(project));
};

export const updateProject = async (req, res) => {
  const updates = { ...req.body };
  delete updates.orgId;
  delete updates.createdBy;
  delete updates.members;
  if (updates.team !== undefined) {
    updates.teamId = updates.team || null;
    delete updates.team;
  }
  if (updates.startDate) updates.startDate = new Date(updates.startDate);
  if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);

  const existing = await prisma.project.findFirst({ where: { id: req.params.id, orgId: req.auth.orgId } });
  if (!existing) return res.status(404).json({ message: "Project not found" });

  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: updates,
    include: { team: { select: { id: true, name: true } }, members: true },
  });
  res.json(shapeProject(project));
};

export const deleteProject = async (req, res) => {
  const existing = await prisma.project.findFirst({ where: { id: req.params.id, orgId: req.auth.orgId } });
  if (!existing) return res.status(404).json({ message: "Project not found" });

  // onDelete: Cascade on Task/Document/ProjectMember relations handles cleanup.
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ message: "Project deleted" });
};
