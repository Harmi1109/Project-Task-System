import { prisma } from "../lib/prisma.js";
import { notify } from "../utils/notify.js";

// Comments can attach to a task or a project; we look up the right table
// to know who should be notified (the assignee, falling back to the creator).
const findParent = async (parentType, parentId) => {
  if (parentType === "task") return prisma.task.findUnique({ where: { id: parentId } });
  if (parentType === "project") return prisma.project.findUnique({ where: { id: parentId } });
  return null;
};

export const listComments = async (req, res) => {
  const { parentType, parentId } = req.query;
  if (!parentType || !parentId) {
    return res.status(400).json({ message: "parentType and parentId are required" });
  }
  const comments = await prisma.comment.findMany({
    where: { orgId: req.auth.orgId, parentType, parentId },
    orderBy: { createdAt: "asc" },
  });
  res.json(comments);
};

export const createComment = async (req, res) => {
  const { parentType, parentId, body } = req.body;
  if (!parentType || !parentId || !body) {
    return res.status(400).json({ message: "parentType, parentId and body are required" });
  }

  const comment = await prisma.comment.create({
    data: { orgId: req.auth.orgId, parentType, parentId, body, author: req.auth.userId },
  });

  const parent = await findParent(parentType, parentId);
  const notifyTarget = parent?.assignee || parent?.createdBy;
  if (notifyTarget && notifyTarget !== req.auth.userId) {
    await notify({
      orgId: req.auth.orgId,
      recipient: notifyTarget,
      type: "comment_added",
      message: `New comment on "${parent.title || parent.name}"`,
      link: parentType === "task" ? `/projects/${parent.projectId}` : `/projects/${parent.id}`,
      triggeredBy: req.auth.userId,
    });
  }

  res.status(201).json(comment);
};

export const deleteComment = async (req, res) => {
  const existing = await prisma.comment.findFirst({
    where: { id: req.params.id, orgId: req.auth.orgId, author: req.auth.userId },
  });
  if (!existing) return res.status(404).json({ message: "Comment not found or not yours" });

  await prisma.comment.delete({ where: { id: req.params.id } });
  res.json({ message: "Comment deleted" });
};
