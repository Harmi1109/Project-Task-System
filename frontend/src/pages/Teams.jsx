import { useEffect, useState } from "react";
import { Plus, UserPlus, X, Trash2, Users } from "lucide-react";
import { useApi } from "../lib/useApi.js";

export default function Teams() {
  const api = useApi();
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [addingTo, setAddingTo] = useState(null);
  const [newMemberId, setNewMemberId] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get("/teams");
      setTeams(data);
    } catch (error) {
      console.error("Failed to load teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTeam = async (e) => {
    e.preventDefault();
    await api.post("/teams", form);
    setForm({ name: "", description: "" });
    setShowForm(false);
    load();
  };

  const addMember = async (teamId) => {
    if (!newMemberId.trim()) return;
    await api.post(`/teams/${teamId}/members`, { userId: newMemberId.trim() });
    setNewMemberId("");
    setAddingTo(null);
    load();
  };

  const removeMember = async (teamId, userId) => {
    await api.delete(`/teams/${teamId}/members/${userId}`);
    load();
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-6 max-w-6xl mx-auto bg-amber-50/20">
        <div className="flex justify-between items-center">
          <div className="space-y-2 w-1/3">
            <div className="h-7 bg-amber-100/50 rounded-md" />
            <div className="h-4 bg-amber-50/40 rounded-md" />
          </div>
          <div className="h-9 w-28 bg-amber-100/50 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-white/60 border border-amber-100/40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-6 lg:px-8 py-8 min-h-screen bg-[linear-gradient(to_bottom,#fdfbf7,#f9f5eb)] text-amber-950 selection:bg-amber-200/60">
      
      {/* Module Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-amber-200/20 pb-4">
        <div className="space-y-1.5">
          <h1 className="font-display text-2xl sm:text-3xl font-light tracking-wide text-amber-950">
            Teams
          </h1>
          <p className="text-amber-700/60 text-xs sm:text-sm mt-1.5 font-medium tracking-wide">
            Groups of people working together across organizational projects.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-950 hover:bg-amber-900 text-white text-xs font-semibold tracking-wider uppercase rounded-lg shadow-[0_4px_10px_rgba(65,40,15,0.15)] active:scale-[0.98] transition-all duration-200 focus-ring self-start sm:self-center"
        >
          <Plus size={14} strokeWidth={2.5} /> New Team
        </button>
      </div>

      {/* Main Grid Section */}
      {teams.length === 0 ? (
        <div className="bg-white/60 border border-amber-200/40 rounded-xl p-16 text-center flex flex-col items-center justify-center shadow-[0_4px_15px_-4px_rgba(230,215,180,0.15)]">
          <div className="p-3.5 bg-amber-50/50 rounded-full border border-amber-100/60 mb-4 text-amber-600">
            <Users size={20} strokeWidth={1.5} />
          </div>
          <h3 className="text-amber-900 font-medium text-sm tracking-wide mb-1">No Active Groups</h3>
          <p className="text-amber-700/60 text-xs max-w-xs font-light leading-relaxed">
            There are no collaborative segments configured yet. Establish your first team to link memberships.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {teams.map((team) => (
            <div 
              key={team.id} 
              className="bg-white/95 border border-amber-200/40 rounded-xl p-6 shadow-[0_4px_20px_-4px_rgba(230,215,180,0.25)] hover:shadow-[0_8px_25px_-5px_rgba(215,195,140,0.35)] hover:border-amber-300/60 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <h3 className="font-display font-semibold text-amber-950 text-base mb-1 group-hover:text-yellow-900 transition-colors">
                  {team.name}
                </h3>
                <p className="text-sm text-amber-900/70 font-light mb-5 leading-relaxed">
                  {team.description || "No descriptions mapped to this group workspace."}
                </p>
                
                {/* Team Roster List */}
                <div className="space-y-2 mb-4">
                  {team.members.map((m) => (
                    <div 
                      key={m.userId} 
                      className="flex items-center justify-between bg-amber-50/40 border border-amber-100/20 rounded-lg px-3 py-1.5 hover:bg-amber-50 transition-colors"
                    >
                      <span className="text-xs font-mono text-amber-900/80 truncate max-w-[65%]">
                        {m.userId}
                      </span>
                      <div className="flex items-center gap-2.5 pl-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded-md">
                          {m.role}
                        </span>
                        <button
                          onClick={() => removeMember(team.id, m.userId)}
                          className="text-amber-700/40 hover:text-red-700 transition-colors focus-ring p-0.5 rounded"
                          aria-label="Remove member"
                        >
                          <Trash2 size={13} strokeWidth={2.2} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic In-line Member Action Drawer */}
              <div className="border-t border-amber-50 pt-4 mt-auto">
                {addingTo === team.id ? (
                  <div className="flex gap-2 animate-fadeIn">
                    <input
                      autoFocus
                      value={newMemberId}
                      onChange={(e) => setNewMemberId(e.target.value)}
                      placeholder="Clerk user ID (user_xxx)"
                      className="flex-1 bg-amber-50/30 border border-amber-200/60 rounded-lg px-3 py-1.5 text-xs font-mono text-amber-950 placeholder-amber-700/30 focus-ring focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => addMember(team.id)}
                        className="px-3 py-1.5 bg-amber-950 text-white text-xs font-semibold rounded-md hover:bg-amber-900 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setAddingTo(null)}
                        className="px-2 py-1.5 bg-amber-50 border border-amber-200/40 text-amber-800 rounded-md hover:bg-amber-100 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingTo(team.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-amber-800 hover:text-amber-950 transition-colors uppercase focus-ring"
                  >
                    <UserPlus size={13} strokeWidth={2.2} /> Add Group Member
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Team Creation Modal Wrapper Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-amber-950/20 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white/95 border border-amber-200/60 rounded-2xl w-full max-w-md p-6 shadow-[0_20px_50px_-12px_rgba(65,40,15,0.25)] relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-5 pb-2 border-b border-amber-50">
              <h3 className="font-display font-medium text-amber-950 text-base tracking-wide">
                Create New Team Circle
              </h3>
              <button 
                onClick={() => setShowForm(false)} 
                className="p-1.5 rounded-lg text-amber-700/60 hover:bg-amber-50 hover:text-amber-950 transition-colors focus-ring"
              >
                <X size={16} strokeWidth={2.2} />
              </button>
            </div>

            <form onSubmit={createTeam} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest text-amber-700/60 uppercase pl-0.5">Team Name</label>
                <input
                  required
                  value={form.name}
                  placeholder="E.g., Creative Lab Division"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-amber-50/20 border border-amber-200/60 rounded-lg px-3.5 py-2 text-sm text-amber-950 placeholder-amber-700/30 focus-ring focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1 pb-2">
                <label className="text-[10px] font-bold tracking-widest text-amber-700/60 uppercase pl-0.5">Description Context</label>
                <textarea
                  value={form.description}
                  placeholder="Delineate workflow scopes, architectural ownership guidelines, or structural purposes..."
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-amber-50/20 border border-amber-200/60 rounded-lg px-3.5 py-2 text-sm text-amber-950 placeholder-amber-700/30 focus-ring focus:outline-none focus:border-amber-400 focus:bg-white transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-950 hover:bg-amber-900 text-white text-xs font-semibold tracking-wider uppercase rounded-lg shadow-sm transition-colors focus-ring"
              >
                Instantiate Team Assembly
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}