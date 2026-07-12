import { Outlet, Navigate } from "react-router-dom";
import { useAuth, useOrganization } from "@clerk/clerk-react";
import Navbar from "./Navbar.jsx";

export default function ProtectedLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { organization, isLoaded: orgLoaded } = useOrganization();

  if (!isLoaded || !orgLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading…</div>;
  }
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {!organization ? (
          <div className="max-w-lg mx-auto mt-16 text-center bg-white border border-slate-200 rounded-2xl p-10">
            <h2 className="font-display text-xl font-semibold mb-2">Pick or create an organization</h2>
            <p className="text-slate-500 text-sm">
              Every project, team, and task lives inside an organization. Use the switcher in the
              top bar to select one, or create a new one to get started.
            </p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
