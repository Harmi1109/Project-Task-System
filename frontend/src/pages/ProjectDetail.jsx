import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, FolderPlus } from "lucide-react";
import { useApi } from "../lib/useApi.js";
import TaskBoard from "../components/TaskBoard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import CommentSection from "../components/CommentSection.jsx";
import { StatusBadge, PriorityBadge } from "../components/Badge.jsx";

export default function ProjectDetail() {
  const { id } = useParams();
  const api = useApi();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [modalTask, setModalTask] = useState(undefined); // undefined = closed, null = new
  const [tab, setTab] = useState("board");

  const load = async () => {
    try {
      const [{ data: proj }, { data: tsk }, { data: docs }] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get("/tasks", { params: { project: id } }),
        api.get("/documents", { params: { project: id } }),
      ]);
      setProject(proj);
      setTasks(tsk);
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch project details:", error);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (taskId, status) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    await api.put(`/tasks/${taskId}`, { status });
  };

  const handleSavedTask = (task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      return exists ? prev.map((t) => (t.id === task.id ? task : t)) : [task, ...prev];
    });
  };

  const handleDeletedTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_bottom,#fdfbf7,#f9f5eb)] flex items-center justify-center">
        <p className="text-amber-800/60 text-sm font-medium animate-pulse tracking-wider uppercase">
          Loading project studio…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-6 lg:px-8 py-8 min-h-screen bg-[linear-gradient(to_bottom,#fdfbf7,#f9f5eb)] text-amber-950 selection:bg-amber-200/60">
      
      {/* Back Link Nav */}
      <Link 
        to="/projects" 
        className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-700/70 hover:text-amber-900 transition-colors w-fit focus-ring p-1"
      >
        <ArrowLeft size={14} strokeWidth={2.2} /> Back to projects
      </Link>

      {/* Project Master Title Blocks */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="font-display text-2xl sm:text-3xl font-light tracking-wide text-amber-950">
            {project.name}
          </h1>
          <p className="text-amber-900/70 text-sm font-light max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-white/40 p-2 border border-amber-200/30 rounded-xl w-fit self-start">
          <PriorityBadge priority={project.priority} />
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Modern Studio Tabs */}
      <div className="flex gap-2 border-b border-amber-200/30">
        {["board", "documents", "discussion"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-xs font-semibold tracking-widest uppercase transition-all duration-300 border-b-2 -mb-px focus-ring relative ${
              tab === t 
                ? "border-amber-800 text-amber-950 font-bold" 
                : "border-transparent text-amber-700/50 hover:text-amber-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="transition-all duration-300">
        {tab === "board" && (
          <TaskBoard
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onSelectTask={(task) => setModalTask(task)}
            onCreateTask={() => setModalTask(null)}
          />
        )}

        {tab === "documents" && (
          <DocumentsTab projectId={id} documents={documents} onChange={setDocuments} api={api} />
        )}

        {tab === "discussion" && (
          <div className="bg-white/95 border border-amber-200/40 rounded-xl p-6 max-w-2xl shadow-[0_4px_20px_-4px_rgba(230,215,180,0.25)]">
            <CommentSection parentType="project" parentId={id} />
          </div>
        )}
      </div>

      {/* Floating Task Modal Controller */}
      {modalTask !== undefined && (
        <TaskModal
          task={modalTask}
          projectId={id}
          onClose={() => setModalTask(undefined)}
          onSaved={handleSavedTask}
          onDeleted={handleDeletedTask}
        />
      )}
    </div>
  );
}

function DocumentsTab({ projectId, documents, onChange, api }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", fileUrl: "" });

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/documents", { ...form, project: projectId, fileType: "text" });
    onChange([data, ...documents]);
    setForm({ title: "", content: "", fileUrl: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 bg-amber-950 text-white text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-amber-900 shadow-[0_4px_10px_rgba(65,40,15,0.15)] active:scale-[0.98] transition-all duration-200 focus-ring"
        >
          {showForm ? "Cancel Form" : "Add Document"}
        </button>
      </div>

      {/* Sophisticated Linen Form Input Block */}
      {showForm && (
        <form onSubmit={submit} className="bg-white/95 border border-amber-200/50 rounded-xl p-6 space-y-4 max-w-2xl shadow-[0_4px_20px_-4px_rgba(230,215,180,0.25)] animate-fadeIn">
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest text-amber-700/60 uppercase pl-1">Document Title</label>
            <input
              required
              placeholder="E.g., Architecture Design Guidelines"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-amber-50/30 border border-amber-200/60 rounded-lg px-4 py-2.5 text-sm text-amber-950 placeholder-amber-700/30 focus-ring focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest text-amber-700/60 uppercase pl-1">Notes / Core Content</label>
            <textarea
              placeholder="Paste content markdown descriptions, copy blocks, or structural project details..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
              className="w-full bg-amber-50/30 border border-amber-200/60 rounded-lg px-4 py-2.5 text-sm text-amber-950 placeholder-amber-700/30 focus-ring focus:outline-none focus:border-amber-400 focus:bg-white transition-all resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest text-amber-700/60 uppercase pl-1">External File URL (Optional)</label>
            <input
              placeholder="https://drive.google.com/..."
              value={form.fileUrl}
              onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
              className="w-full bg-amber-50/30 border border-amber-200/60 rounded-lg px-4 py-2.5 text-sm text-amber-950 placeholder-amber-700/30 focus-ring focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
            />
          </div>

          <button className="px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold tracking-wider uppercase rounded-lg shadow-sm transition-colors focus-ring">
            Save Document Entry
          </button>
        </form>
      )}

      {/* Document Storage Cards Grid */}
      {documents.length === 0 ? (
        <div className="bg-white/60 border border-amber-200/40 rounded-xl p-14 text-center flex flex-col items-center justify-center shadow-[0_4px_15px_-4px_rgba(230,215,180,0.15)]">
          <div className="p-3 bg-amber-50/50 rounded-full border border-amber-100/60 mb-3 text-amber-600">
            <FolderPlus size={20} strokeWidth={1.5} />
          </div>
          <h3 className="text-amber-900 font-medium text-sm tracking-wide mb-1">No Project Documents</h3>
          <p className="text-amber-700/60 text-xs max-w-xs font-light leading-relaxed">
            This asset vault is empty. Click "Add Document" to store clean links and notes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((d) => (
            <div 
              key={d.id} 
              className="group bg-white/95 border border-amber-200/40 rounded-xl p-6 shadow-[0_4px_20px_-4px_rgba(230,215,180,0.25)] hover:shadow-[0_10px_25px_-5px_rgba(215,195,140,0.35)] hover:border-amber-300/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-100/60 text-amber-800 transition-transform group-hover:scale-105">
                    <FileText size={15} strokeWidth={2} />
                  </div>
                  <h4 className="font-display font-medium text-amber-950 text-base pt-0.5 group-hover:text-yellow-900 transition-colors">
                    {d.title}
                  </h4>
                </div>
                
                {d.content && (
                  <p className="text-sm text-amber-900/70 font-light whitespace-pre-wrap pl-10 mb-4 leading-relaxed line-clamp-4">
                    {d.content}
                  </p>
                )}
              </div>

              {d.fileUrl && (
                <div className="pl-10 border-t border-amber-50 pt-3 mt-2">
                  <a 
                    href={d.fileUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1 text-xs font-bold tracking-wider text-amber-700 hover:text-amber-900 transition-colors uppercase group-hover:underline"
                  >
                    Open Asset Link &rarr;
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}