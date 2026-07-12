import { prisma } from "../lib/prisma.js";
import { notify } from "../utils/notify.js";

export const listDocuments = async (req, res) => {
  const { project } = req.query;
  const where = { orgId: req.auth.orgId };
  if (project) where.projectId = project;

  const docs = await prisma.document.findMany({ where, orderBy: { createdAt: "desc" } });
  res.json(docs);
};

export const getDocument = async (req, res) => {
  const doc = await prisma.document.findFirst({ where: { id: req.params.id, orgId: req.auth.orgId } });
  if (!doc) return res.status(404).json({ message: "Document not found" });
  res.json(doc);
};

export const createDocument = async (req, res) => {
  const { project, title, fileUrl, fileType, content } = req.body;
  if (!project || !title) return res.status(400).json({ message: "project and title are required" });

  const projectDoc = await prisma.project.findFirst({
    where: { id: project, orgId: req.auth.orgId },
    include: { members: true },
  });
  if (!projectDoc) return res.status(404).json({ message: "Project not found" });

  const doc = await prisma.document.create({
    data: {
      orgId: req.auth.orgId,
      projectId: project,
      title,
      fileUrl,
      fileType,
      content,
      uploadedBy: req.auth.userId,
    },
  });

  await Promise.all(
    projectDoc.members
      .map((m) => m.userId)
      .filter((m) => m !== req.auth.userId)
      .map((m) =>
        notify({
          orgId: req.auth.orgId,
          recipient: m,
          type: "document_uploaded",
          message: `New document "${doc.title}" added to ${projectDoc.name}`,
          link: `/projects/${project}`,
          triggeredBy: req.auth.userId,
        })
      )
  );

  res.status(201).json(doc);
};

export const updateDocument = async (req, res) => {
  const updates = { ...req.body };
  delete updates.orgId;
  delete updates.uploadedBy;
  delete updates.project;
  delete updates.projectId;

  const existing = await prisma.document.findFirst({ where: { id: req.params.id, orgId: req.auth.orgId } });
  if (!existing) return res.status(404).json({ message: "Document not found" });

  const doc = await prisma.document.update({ where: { id: req.params.id }, data: updates });
  res.json(doc);
};

export const deleteDocument = async (req, res) => {
  const existing = await prisma.document.findFirst({ where: { id: req.params.id, orgId: req.auth.orgId } });
  if (!existing) return res.status(404).json({ message: "Document not found" });

  await prisma.document.delete({ where: { id: req.params.id } });
  res.json({ message: "Document deleted" });
};
