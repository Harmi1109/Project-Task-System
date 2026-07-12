import { prisma } from "../lib/prisma.js";

export const listNotifications = async (req, res) => {
  const { unreadOnly } = req.query;
  const where = { orgId: req.auth.orgId, recipient: req.auth.userId };
  if (unreadOnly === "true") where.read = false;

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.notification.count({ where: { orgId: req.auth.orgId, recipient: req.auth.userId, read: false } }),
  ]);
  res.json({ notifications, unreadCount });
};

export const markRead = async (req, res) => {
  const existing = await prisma.notification.findFirst({
    where: { id: req.params.id, recipient: req.auth.userId },
  });
  if (!existing) return res.status(404).json({ message: "Notification not found" });

  const notification = await prisma.notification.update({
    where: { id: req.params.id },
    data: { read: true },
  });
  res.json(notification);
};

export const markAllRead = async (req, res) => {
  await prisma.notification.updateMany({
    where: { orgId: req.auth.orgId, recipient: req.auth.userId, read: false },
    data: { read: true },
  });
  res.json({ message: "All notifications marked as read" });
};

export const deleteNotification = async (req, res) => {
  const existing = await prisma.notification.findFirst({
    where: { id: req.params.id, recipient: req.auth.userId },
  });
  if (!existing) return res.status(404).json({ message: "Notification not found" });

  await prisma.notification.delete({ where: { id: req.params.id } });
  res.json({ message: "Notification deleted" });
};
