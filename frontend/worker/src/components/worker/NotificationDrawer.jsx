// src/components/worker/NotificationDrawer.jsx
export default function NotificationDrawer({
  open,
  onClose,
  notifications,
  setNotifications
}) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, unread:false })));

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-h-[85vh] flex flex-col ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={markAllRead} className="text-xs text-indigo-600 font-semibold">
            Mark all read
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex gap-3 p-3 rounded-xl transition-colors ${n.unread ? "bg-indigo-50" : "bg-gray-50"}`}
            >
              <div className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm">
                {n.type === "payout" && (<span className="text-lg font-bold text-indigo-600">₹</span>)}
                {n.type === "trigger" && <span className="text-lg">⚡</span>}
                {n.type === "renewal" && <span className="text-lg">🔄</span>}
                {n.type === "info" && <span className="text-lg">ℹ️</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className={`text-sm font-semibold ${n.unread ? "text-gray-900" : "text-gray-600"}`}>
                    {n.title}
                  </p>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {n.time}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {n.body}
                </p>
              </div>
              {n.unread && (
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="h-6" />
      </div>
    </>
  );
}