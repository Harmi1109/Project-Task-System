import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { FolderKanban, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useApi } from "../lib/useApi.js";
import ProjectCard from "../components/ProjectCard.jsx";

export default function Dashboard() {
  const api = useApi();
  const { user } = useUser();
  const [overview, setOverview] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: ov }, { data: proj }] = await Promise.all([
          api.get("/reports/overview"),
          api.get("/projects"),
        ]);
        setOverview(ov);
        setProjects(proj.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doneCount = overview?.taskStatusBreakdown?.find((s) => s._id === "done")?.count || 0;
  const totalTasks = overview?.taskStatusBreakdown?.reduce((sum, s) => sum + s.count, 0) || 0;

  const stats = [
    { label: "Total Projects", value: overview?.projectCount ?? "—", icon: FolderKanban },
    { label: "Active Teams", value: overview?.teamCount ?? "—", icon: Users },
    { label: "Tasks Completed", value: totalTasks > 0 ? `${doneCount}/${totalTasks}` : "0/0", icon: CheckCircle2 },
    { label: "Overdue Tasks", value: overview?.overdueTasks ?? "—", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Studio Header Card with Ambient Background Image */}
      <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper-raised)] flex flex-col md:flex-row items-stretch min-h-[180px]">
        <div className="p-8 flex-1 flex flex-col justify-center space-y-2 z-10">
          <span className="font-mono text-[10px] tracking-widest text-[var(--color-ink-soft)] uppercase">
            Workspace Briefing
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--color-ink)]">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="text-[var(--color-ink-soft)] text-sm max-w-md font-body">
            Here is what is happening across your organization's digital canvases today.
          </p>
        </div>
        
        {/* Aesthetic Studio Art Image Segment */}
        <div className="w-full md:w-72 relative min-h-[140px] md:min-h-full overflow-hidden border-t md:border-t-0 md:border-l border-[var(--color-line)]">
          <img 
            src="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcRszNwjJqfzfWeCB0p640SJTMFzzfqhmHHVEJCXPtsv0RKmXpydfHNfkQ-RuDOUfuiQ_TsNaib-ib85Jbk" 
            alt="Warm minimalist ambient studio workspace scene" 
            className="w-full h-full object-cover grayscale-[15%] contrast-[105%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-paper-raised)] via-transparent to-transparent opacity-40 md:opacity-100 mix-blend-multiply" />
        </div>
      </div>

      {/* Metrics Section using your CSS card variables */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div 
            key={label} 
            className="card p-5 bg-[var(--color-paper-raised)] border border-[var(--color-line)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-wider text-[var(--color-ink-soft)] uppercase">
                {label}
              </span>
              <Icon size={15} className="text-[var(--color-pine-soft)]" strokeWidth={2} />
            </div>
            <p className="font-display text-2xl font-semibold text-[var(--color-ink)] tracking-tight">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Workspaces View */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-[var(--color-line)] pb-2">
          <h2 className="font-display text-base font-semibold text-[var(--color-ink)]">
            Recent Projects
          </h2>
          <Link 
            to="/projects" 
            className="font-mono text-[11px] tracking-wider text-[var(--color-ink-soft)] hover:text-[var(--color-pine)] transition-colors uppercase"
          >
            View All &rarr;
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-[var(--color-paper-raised)] border border-dashed border-[var(--color-mist)] rounded-[var(--radius-card)] p-12 text-center flex flex-col items-center justify-center">
            <h3 className="text-[var(--color-ink-soft)] font-medium text-sm mb-3">No Active Projects Available</h3>
            <Link to="/projects" className="btn-primary">
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}