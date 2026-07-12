import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { StatusBadge, PriorityBadge } from "./Badge.jsx";

export default function ProjectCard({ project }) {
  // 1. Safeguard task collections from the database
  const tasks = project.tasks || [];
  const totalTasks = tasks.length;
  
  // 2. Count tasks that have explicitly shifted to the final column
  const doneTasks = tasks.filter(t => t.status?.toLowerCase() === 'done' || t.status?.toLowerCase() === 'completed').length;
  
  // 3. Handle live progression percentage mathematical evaluation
  const progressPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-600 hover:shadow-sm transition-all focus-ring"
    >
      {/* Header Info */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-display font-semibold text-slate-900">{project.name}</h3>
        <PriorityBadge priority={project.priority} />
      </div>

      {/* Description Panel Block */}
      <p className="text-sm text-slate-500 line-clamp-2 mb-3 min-h-[2.5rem]">
        {project.description || "No description yet."}
      </p>

      {/* 📈 PROGRESS TRACKING METRIC LAYER */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Progress ({doneTasks}/{totalTasks} Tasks)</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-700 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Footer Info Details */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
        <StatusBadge status={project.status} />
        {project.dueDate && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <CalendarDays size={13} />
            {new Date(project.dueDate).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short'
            })}
          </span>
        )}
      </div>
    </Link>
  );
}