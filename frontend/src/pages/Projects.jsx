import { useEffect, useState } from "react";
import { Plus, X, FolderKanban } from "lucide-react";
import { useApi } from "../lib/useApi.js";
import ProjectCard from "../components/ProjectCard.jsx";

export default function Projects() {
  const api = useApi();
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", team: "", priority: "medium", dueDate: "" });

  const load = async () => {
    try {
      const [{ data: proj }, { data: tm }] = await Promise.all([api.get("/projects"), api.get("/teams")]);
      setProjects(proj);
      setTeams(tm);
    } catch (error) {
      console.error("Failed to load projects data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      const { data: newProject } = await api.post("/projects", { 
        ...form, 
        team: form.team || undefined,
        status: "planning" // Initial project status defaults to planning
      });
      
      setProjects((prev) => [newProject, ...prev]);
      setForm({ name: "", description: "", team: "", priority: "medium", dueDate: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-6 max-w-6xl mx-auto bg-white/40 rounded-xl">
        <div className="flex justify-between items-center">
          <div className="space-y-2 w-1/3">
            <div className="h-7 bg-slate-200/60 rounded-md" />
            <div className="h-4 bg-slate-200/40 rounded-md" />
          </div>
          <div className="h-9 w-28 bg-slate-200/60 rounded-lg" />
        </div>
        <div className="h-10 w-full max-w-xl bg-white/60 rounded-full border border-slate-200/40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 bg-white/80 border border-slate-200/40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-6 lg:px-8 py-6 min-h-screen bg-[#f9f7f4] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* BasecampLite Workspace Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Projects
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Everything your organization is building.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm active:scale-[0.98] transition-all duration-200 self-start sm:self-center"
        >
          <Plus size={14} strokeWidth={2.5} /> New Project
        </button>
      </div>

      {/* Modern Light Theme Filter Control Bar */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 max-w-full touch-pan-x">
        {["all", "planning", "active", "on_hold", "completed", "archived"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide capitalize transition-all duration-200 whitespace-nowrap ${
              filter === s 
                ? "bg-white border border-slate-300 text-slate-900 shadow-sm font-bold" 
                : "bg-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Main Grid View Area */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="p-3.5 bg-slate-50 rounded-full border border-slate-100 mb-4 text-slate-400">
            <FolderKanban size={20} strokeWidth={1.5} />
          </div>
          <h3 className="text-slate-800 font-semibold text-sm mb-1">No Matching Pipelines</h3>
          <p className="text-slate-500 text-xs max-w-xs font-light leading-relaxed">
            There are currently no workspaces set with this particular filter attribute.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fadeIn">
          {filtered.map((p) => (
            <div key={p.id} className="hover:-translate-y-0.5 transition-all duration-200">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      )}

      {/* Light Theme Project Overlay Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[1px] flex items-center justify-center z-50 p-4 default-modal">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md p-6 shadow-xl relative overflow-hidden">
            
            {/* Modal Header Controls */}
            <div className="flex items-center justify-between mb-5 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                New Basecamp Project
              </h3>
              <button 
                onClick={() => setShowForm(false)} 
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                <X size={16} strokeWidth={2.2} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={createProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase pl-0.5">Project Name</label>
                <input
                  required
                  value={form.name}
                  placeholder="E.g., Brand Re-design Phase I"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase pl-0.5">Description</label>
                <textarea
                  value={form.description}
                  placeholder="Brief summary of targets, visual scope, and parameters..."
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase pl-0.5">Assign Team</label>
                  <select
                    value={form.team}
                    onChange={(e) => setForm({ ...form, team: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  >
                    <option value="">No team assigned</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase pl-0.5">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 pb-2">
                <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase pl-0.5">Target Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold tracking-wider uppercase rounded-lg shadow-sm transition-colors"
              >
                Establish Project Pipeline
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}