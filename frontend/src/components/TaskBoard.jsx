import { useState } from "react";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard.jsx";

const COLUMNS = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "in_review", label: "In review" },
  { key: "done", label: "Done" },
];

export default function TaskBoard({ tasks, onStatusChange, onSelectTask, onCreateTask }) {
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) onStatusChange(taskId, status);
    setDragOverCol(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverCol(col.key);
            }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => handleDrop(e, col.key)}
            className={`rounded-xl p-3 min-h-[300px] border-2 border-dashed transition-colors ${
              dragOverCol === col.key ? "border-pine-400 bg-pine-50/50" : "border-transparent bg-slate-100/60"
            }`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {col.label} <span className="text-slate-400">({colTasks.length})</span>
              </h4>
              {col.key === "todo" && (
                <button
                  onClick={onCreateTask}
                  className="text-slate-400 hover:text-pine-600 focus-ring rounded"
                  aria-label="Add task"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
            <div className="space-y-2">
              {colTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDragStart={handleDragStart}
                  onClick={() => onSelectTask(task)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
