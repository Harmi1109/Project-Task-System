import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useApi } from "../lib/useApi.js";

// Tailored Yellow Light Studio color mapping constants
const STATUS_COLORS = { 
  todo: "#c2b49a",        // Muted Linen Clay
  in_progress: "#d99e32", // Warm Toasted Honey
  in_review: "#b58943",   // Studio Ochre
  done: "#576144"         // Deep Sage Olive
};

const PRIORITY_COLORS = { 
  low: "#c2b49a",         // Muted Linen Clay
  medium: "#7c8567",      // Soft Olive Sage
  high: "#d99e32",        // Warm Toasted Honey
  urgent: "#ab3a24"       // Terracotta Clay
};

export default function Reports() {
  const api = useApi();
  const [overview, setOverview] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [projectReport, setProjectReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: ov }, { data: proj }] = await Promise.all([
          api.get("/reports/overview"),
          api.get("/projects"),
        ]);
        setOverview(ov);
        setProjects(proj);
        if (proj[0]) setSelectedProject(proj[0].id);
      } catch (error) {
        console.error("Failed to fetch reports data:", error);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    api.get(`/reports/projects/${selectedProject}`).then(({ data }) => setProjectReport(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  const statusData = (overview?.taskStatusBreakdown || []).map((s) => ({ name: s._id, value: s.count }));
  const priorityData = (overview?.tasksByPriority || []).map((p) => ({ name: p._id, value: p.count }));

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-6 max-w-6xl mx-auto bg-amber-50/20">
        <div className="space-y-2 w-1/4">
          <div className="h-7 bg-amber-100/50 rounded-md" />
          <div className="h-4 bg-amber-50/40 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-white/60 border border-amber-100/40 rounded-xl" />
          <div className="h-64 bg-white/60 border border-amber-100/40 rounded-xl" />
        </div>
        <div className="h-40 bg-white/40 border border-amber-100/40 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-6 lg:px-8 py-8 min-h-screen bg-[linear-gradient(to_bottom,#fdfbf7,#f9f5eb)] text-amber-950 selection:bg-amber-200/60">
      
      {/* Analytics Main Header */}
      <div className="relative pb-2 border-b border-amber-200/20">
        <h1 className="font-display text-2xl sm:text-3xl font-light tracking-wide text-amber-950">
          Reports
        </h1>
        <p className="text-amber-700/60 text-xs sm:text-sm mt-1.5 font-medium tracking-wide">
          Live insights computed from your organization's environment metrics.
        </p>
      </div>

      {/* Charts Block View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pie Chart Card Container */}
        <div className="bg-white/95 border border-amber-200/40 rounded-xl p-6 shadow-[0_4px_20px_-4px_rgba(230,215,180,0.25)] hover:shadow-[0_8px_25px_-5px_rgba(215,195,140,0.3)] transition-all duration-300">
          <h3 className="text-[11px] font-bold tracking-widest text-amber-700/60 uppercase mb-5">
            Tasks by status
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie 
                data={statusData} 
                dataKey="value" 
                nameKey="name" 
                innerRadius={55} 
                outerRadius={80}
                paddingAngle={3}
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#c2b49a"} className="focus:outline-none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #f1e4cc", borderRadius: "8px", fontSize: "12px", color: "#451a03" }}
                itemStyle={{ color: "#451a03" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart Card Container */}
        <div className="bg-white/95 border border-amber-200/40 rounded-xl p-6 shadow-[0_4px_20px_-4px_rgba(230,215,180,0.25)] hover:shadow-[0_8px_25px_-5px_rgba(215,195,140,0.3)] transition-all duration-300">
          <h3 className="text-[11px] font-bold tracking-widest text-amber-700/60 uppercase mb-5">
            Tasks by priority
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#78350f", fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#78350f", fontWeight: 500 }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: "rgba(253, 251, 247, 0.6)" }}
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #f1e4cc", borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={32}>
                {priorityData.map((entry) => (
                  <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name] || "#c2b49a"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Completion Metric Area */}
      <div className="bg-white/95 border border-amber-200/40 rounded-xl p-6 shadow-[0_4px_20px_-4px_rgba(230,215,180,0.25)] hover:shadow-[0_8px_25px_-5px_rgba(215,195,140,0.3)] transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-amber-50">
          <h3 className="text-[11px] font-bold tracking-widest text-amber-700/60 uppercase">
            Project completion
          </h3>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-amber-50/40 border border-amber-200/60 rounded-lg px-3 py-1.5 text-xs font-semibold text-amber-950 focus-ring focus:outline-none focus:border-amber-400 focus:bg-white transition-all w-full sm:w-fit"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        
        {projectReport && (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-24 h-24 shrink-0 transition-transform hover:scale-105 duration-300">
              <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f5ecd5"
                  strokeWidth="2.8"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#576144"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeDasharray={`${projectReport.completionRate}, 100`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-sm text-amber-950">
                {projectReport.completionRate}%
              </span>
            </div>
            
            <div className="text-sm text-amber-900/80 font-light leading-relaxed text-center sm:text-left">
              <p>
                <strong>{projectReport.completed}</strong> of <strong>{projectReport.total}</strong> tasks 
                completed in the <span className="font-semibold text-amber-950">{projectReport.project.name}</span> environment workflow.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}