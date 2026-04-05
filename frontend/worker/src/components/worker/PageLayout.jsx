// src/components/worker/PageLayout.jsx
import { useState } from "react";
import NotificationDrawer from "./NotificationDrawer";

const navItems = [
  { label: "Home", icon: "🏠", route: "/dashboard" },
  { label: "Policy", icon: "📋", route: "/policy" },
  { label: "Payouts", icon: "💸", route: "/payouts" },
  { label: "Forecast", icon: "📅", route: "/forecast" },
  { label: "Profile", icon: "👤", route: "/profile" },
];

export default function PageLayout({ children, title = "GigShield", activeRoute = "/dashboard" }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">
      {/* Top Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-white text-xs font-black">G</span>
          </div>
          <h1 className="text-base font-bold text-gray-800">{title}</h1>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-lg"
        >
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white" />
        </button>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4 space-y-4">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 shadow-lg z-30">
        <div className="flex justify-around items-center py-2 px-2">
          {navItems.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.route}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${isActive ? "bg-indigo-50" : ""}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`text-[10px] font-semibold ${isActive ? "text-indigo-600" : "text-gray-400"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        {/* safe area */}
        <div className="h-safe-area-inset-bottom" />
      </nav>

      {/* Notification Drawer */}
      <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}