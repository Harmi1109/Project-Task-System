// Ensures the authenticated request carries an active Clerk organization.
// Clerk's requireAuth() (in auth.js) already guarantees req.auth.userId exists;
// this just adds the organization check every org-scoped route needs.
export const requireOrg = (req, res, next) => {
  const { orgId } = req.auth || {};
  if (!orgId) {
    return res.status(403).json({
      message: "No active organization. Select or create an organization first.",
    });
  }
  next();
};
