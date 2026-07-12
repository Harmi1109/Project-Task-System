import { prisma } from "../lib/prisma.js";

// Team members live in a join table (TeamMember); we shape the response
// back into a simple { userId, role } array so the frontend doesn't need
// to know about the relational structure underneath.
const shapeTeam = (team) => ({
  ...team,
  members: team.members?.map((m) => ({ userId: m.userId, role: m.role })) || [],
});

export const listTeams = async (req, res) => {
  const teams = await prisma.team.findMany({
    where: { orgId: req.auth.orgId },
    include: { members: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(teams.map(shapeTeam));
};

export const getTeam = async (req, res) => {
  const team = await prisma.team.findFirst({
    where: { id: req.params.id, orgId: req.auth.orgId },
    include: { members: true },
  });
  if (!team) return res.status(404).json({ message: "Team not found" });
  res.json(shapeTeam(team));
};

export const createTeam = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "Team name is required" });

  const team = await prisma.team.create({
    data: {
      orgId: req.auth.orgId,
      name,
      description,
      createdBy: req.auth.userId,
      members: { create: [{ userId: req.auth.userId, role: "lead" }] },
    },
    include: { members: true },
  });
  res.status(201).json(shapeTeam(team));
};

export const updateTeam = async (req, res) => {
  const { name, description } = req.body;
  const existing = await prisma.team.findFirst({ where: { id: req.params.id, orgId: req.auth.orgId } });
  if (!existing) return res.status(404).json({ message: "Team not found" });

  const team = await prisma.team.update({
    where: { id: req.params.id },
    data: { name, description },
    include: { members: true },
  });
  res.json(shapeTeam(team));
};

export const deleteTeam = async (req, res) => {
  const existing = await prisma.team.findFirst({ where: { id: req.params.id, orgId: req.auth.orgId } });
  if (!existing) return res.status(404).json({ message: "Team not found" });

  await prisma.team.delete({ where: { id: req.params.id } });
  res.json({ message: "Team deleted" });
};

export const addMember = async (req, res) => {
  const { userId, role = "member" } = req.body;
  if (!userId) return res.status(400).json({ message: "userId is required" });

  const team = await prisma.team.findFirst({ where: { id: req.params.id, orgId: req.auth.orgId } });
  if (!team) return res.status(404).json({ message: "Team not found" });

  const existingMember = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId: team.id, userId } },
  });
  if (existingMember) return res.status(400).json({ message: "User is already a member" });

  await prisma.teamMember.create({ data: { teamId: team.id, userId, role } });

  const updated = await prisma.team.findUnique({ where: { id: team.id }, include: { members: true } });
  res.json(shapeTeam(updated));
};

export const removeMember = async (req, res) => {
  const team = await prisma.team.findFirst({ where: { id: req.params.id, orgId: req.auth.orgId } });
  if (!team) return res.status(404).json({ message: "Team not found" });

  await prisma.teamMember
    .delete({ where: { teamId_userId: { teamId: team.id, userId: req.params.userId } } })
    .catch(() => null); // no-op if it was already removed

  const updated = await prisma.team.findUnique({ where: { id: team.id }, include: { members: true } });
  res.json(shapeTeam(updated));
};
