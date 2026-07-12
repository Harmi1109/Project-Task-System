import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { useApi } from "../lib/useApi.js";
import CommentSection from "./CommentSection.jsx";

export default function TaskModal({ task, projectId, onClose, onSaved, onDeleted }) {
  const api = useApi();
  const isNew = !task?.id;
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    assignee: task?.assignee || "",
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        const { data } = await api.post("/tasks", { ...form, project: projectId });
        onSaved(data);
      } else {
        const { data } = await api.put(`/tasks/${task.id}`, form);
        onSaved(data);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this task?")) return;
    await api.delete(`/tasks/${task.id}`);
    onDeleted(task.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg">{isNew ? "New task" : "Edit task"}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 focus-ring" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus-ring focus:outline-none focus:border-pine-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus-ring focus:outline-none focus:border-pine-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus-ring focus:outline-none focus:border-pine-400"
              >
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="in_review">In review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus-ring focus:outline-none focus:border-pine-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500">Assignee (user ID)</label>
              <input
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                placeholder="user_xxxxx"
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus-ring focus:outline-none focus:border-pine-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Due date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus-ring focus:outline-none focus:border-pine-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {!isNew ? (
              <button
                type="button"
                onClick={remove}
                className="flex items-center gap-1 text-sm text-red-600 hover:underline focus-ring"
              >
                <Trash2 size={14} /> Delete
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-pine-600 text-white text-sm font-medium rounded-lg hover:bg-pine-700 disabled:opacity-60 focus-ring"
            >
              {saving ? "Saving…" : isNew ? "Create task" : "Save changes"}
            </button>
          </div>
        </form>

        {!isNew && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <CommentSection parentType="task" parentId={task.id} />
          </div>
        )}
      </div>
    </div>
  );
}
