import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useApi } from "../lib/useApi.js";

export default function NotificationBell() {
  const api = useApi();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  const load = async () => {
    try {
      const { data } = await api.get("/notifications");
      setItems(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // Silently ignore — the bell just shows stale state until next poll.
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const markAllRead = async () => {
    await api.put("/notifications/read-all");
    load();
  };

  const markOneRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    load();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-slate-100 focus-ring"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-ochre-500 text-white text-[10px] leading-none rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="font-medium text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-pine-600 hover:underline focus-ring">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {items.length === 0 && (
              <p className="px-4 py-6 text-sm text-slate-400 text-center">You're all caught up.</p>
            )}
            {items.map((n) => (
              <button
                key={n.id}
                onClick={() => markOneRead(n.id)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 focus-ring ${
                  !n.read ? "bg-pine-50/60" : ""
                }`}
              >
                <p className="text-ink">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
