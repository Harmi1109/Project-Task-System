import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";
import { useApi } from "../lib/useApi.js";
import { useUser } from "@clerk/clerk-react";

export default function CommentSection({ parentType, parentId }) {
  const api = useApi();
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/comments", { params: { parentType, parentId } });
    setComments(data);
    setLoading(false);
  };

  useEffect(() => {
    if (parentId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    await api.post("/comments", { parentType, parentId, body: body.trim() });
    setBody("");
    load();
  };

  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-600 mb-3">Comments</h4>
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {loading && <p className="text-sm text-slate-400">Loading comments…</p>}
        {!loading && comments.length === 0 && (
          <p className="text-sm text-slate-400">No comments yet. Start the discussion.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="bg-slate-50 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-pine-700 font-mono">
                {c.author === user?.id ? "You" : c.author}
              </span>
              <span className="text-xs text-slate-400">
                {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-ink whitespace-pre-wrap">{c.body}</p>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment…"
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus-ring focus:outline-none focus:border-pine-400"
        />
        <button
          type="submit"
          className="p-2 bg-pine-600 text-white rounded-lg hover:bg-pine-700 focus-ring"
          aria-label="Send comment"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
