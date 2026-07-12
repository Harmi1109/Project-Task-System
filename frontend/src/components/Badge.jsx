const STATUS_STYLES = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-ochre-400/20 text-ochre-600",
  in_review: "bg-pine-100 text-pine-700",
  done: "bg-pine-500/15 text-pine-600",
  planning: "bg-slate-100 text-slate-700",
  active: "bg-ochre-400/20 text-ochre-600",
  on_hold: "bg-red-100 text-red-600",
  completed: "bg-pine-500/15 text-pine-600",
  archived: "bg-slate-200 text-slate-500",
};

const PRIORITY_STYLES = {
  low: "bg-slate-100 text-slate-500",
  medium: "bg-pine-100 text-pine-700",
  high: "bg-ochre-400/20 text-ochre-600",
  urgent: "bg-red-100 text-red-600",
};

export const StatusBadge = ({ status }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"}`}>
    {status?.replace("_", " ")}
  </span>
);

export const PriorityBadge = ({ priority }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${PRIORITY_STYLES[priority] || "bg-slate-100 text-slate-600"}`}>
    {priority}
  </span>
);
