import { PriorityBadge } from "./Badge.jsx";

export default function TaskCard({ task, onClick, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-lg p-3 cursor-pointer hover:border-pine-400 transition-colors focus-ring"
    >
      <p className="text-sm font-medium text-ink mb-2">{task.title}</p>
      <div className="flex items-center justify-between">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className="text-xs text-slate-400 font-mono">
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        )}
      </div>
      {task.assignee && (
        <p className="mt-2 text-xs text-slate-400 truncate">Assignee: {task.assignee}</p>
      )}
    </div>
  );
}
