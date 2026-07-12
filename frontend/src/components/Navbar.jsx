import { NavLink } from "react-router-dom";
import { OrganizationSwitcher, UserButton } from "@clerk/clerk-react";
import { LayoutGrid, KanbanSquare, Users, FileText, BarChart3 } from "lucide-react";
import NotificationBell from "./NotificationBell.jsx";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/projects", label: "Projects", icon: KanbanSquare },
  { to: "/teams", label: "Teams", icon: Users },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <span className="font-display font-semibold text-lg text-pine-600 tracking-tight">
            Basecamp<span className="text-ochre-500">Lite</span>
          </span>
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-ring ${
                    isActive ? "bg-pine-50 text-pine-700" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <OrganizationSwitcher
            hidePersonal
            afterCreateOrganizationUrl="/"
            afterSelectOrganizationUrl="/"
            appearance={{ elements: { organizationSwitcherTrigger: "text-sm" } }}
          />
          <NotificationBell />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  );
}
