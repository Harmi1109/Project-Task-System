import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Folder } from "lucide-react";
import { useApi } from "../lib/useApi.js";

export default function Documents() {
  const api = useApi();
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: docs }, { data: proj }] = await Promise.all([
          api.get("/documents"),
          api.get("/projects"),
        ]);
        setDocuments(docs);
        setProjects(proj);
      } catch (error) {
        console.error("Failed to fetch documents data:", error);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const projectName = (id) => projects.find((p) => p.id === id)?.name || "Unknown project";

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-6 max-w-6xl mx-auto bg-amber-50/20">
        <div className="space-y-3">
          <div className="h-7 w-1/5 bg-amber-100/50 rounded-md" />
          <div className="h-4 w-1/3 bg-amber-50/40 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-white/60 border border-amber-100/40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto px-6 lg:px-8 py-8 min-h-screen bg-[linear-gradient(to_bottom,#fdfbf7,#f9f5eb)] text-amber-950 selection:bg-amber-200/60">
      
      {/* Warm Ambient Header */}
      <div className="relative pb-2 border-b border-amber-200/20">
        <h1 className="font-display text-2xl sm:text-3xl font-light tracking-wide text-amber-950">
          Documents
        </h1>
        <p className="text-amber-700/60 text-xs sm:text-sm mt-1.5 font-medium tracking-wide leading-relaxed max-w-2xl">
          All files and notes across your organization's projects. Add documents from within a project workspace.
        </p>
      </div>

      {/* Content Area */}
      {documents.length === 0 ? (
        <div className="bg-white/60 border border-amber-200/40 rounded-xl p-16 text-center flex flex-col items-center justify-center shadow-[0_4px_15px_-4px_rgba(230,215,180,0.15)]">
          <div className="p-3.5 bg-amber-50/50 rounded-full border border-amber-100/60 mb-4 text-amber-600">
            <FileText size={22} strokeWidth={1.5} />
          </div>
          <h3 className="text-amber-900 font-medium text-sm tracking-wide mb-1">No Documents Found</h3>
          <p className="text-amber-700/60 text-xs max-w-xs font-light leading-relaxed">
            There are currently no files uploaded. Head into an active project to create or upload notes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((d) => (
            <Link
              key={d.id}
              to={`/projects/${d.projectId}`}
              className="group bg-white/95 border border-amber-200/40 rounded-xl p-6 shadow-[0_4px_20px_-4px_rgba(230,215,180,0.25)] hover:shadow-[0_10px_25px_-5px_rgba(215,195,140,0.35)] hover:border-amber-300/80 hover:bg-white transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Title Line with Warm Icon Capsule */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-100/60 text-amber-800 transition-all duration-300 group-hover:scale-105">
                    <FileText size={16} strokeWidth={2} />
                  </div>
                  <h4 className="font-display font-medium text-amber-950 text-base group-hover:text-yellow-900 transition-colors pt-1">
                    {d.title}
                  </h4>
                </div>
                
                {/* Preview text */}
                <p className="text-sm text-amber-900/70 font-light line-clamp-3 pl-11 mb-5 leading-relaxed">
                  {d.content || "No preview available."}
                </p>
              </div>

              {/* Bottom Project Tag */}
              <div className="flex items-center gap-1.5 pl-11 text-[11px] font-semibold tracking-wider text-amber-700/60 uppercase border-t border-amber-50 pt-3 mt-auto">
                <Folder size={12} strokeWidth={2.2} className="text-amber-600/70" />
                <span>In <span className="text-amber-800 font-bold">{projectName(d.projectId)}</span></span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}