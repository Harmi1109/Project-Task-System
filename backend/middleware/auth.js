import { requireAuth } from "@clerk/express";

// Every org-scoped API route needs a signed-in user. This wraps Clerk's
// requireAuth() so route files can import one thing from one place.
export const requireSignedIn = requireAuth();
