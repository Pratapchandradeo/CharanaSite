import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/notifications", label: "Notifications" },
    { path: "/admin/events", label: "Events" },
    { path: "/admin/gallery", label: "Gallery" },
    { path: "/admin/pdfs", label: "Documents" },
  ];

  if (user?.role === "master_admin") {
    menuItems.push(
      { path: "/admin/users", label: "Admin Users" },
      { path: "/admin/activity", label: "Activity Logs" }
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <>
      {/* 🔴 Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => {
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
        />
      )}

      {/* 🛕 Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e31b23] to-black" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #fbb829 2px, transparent 2px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col h-full text-white">
          {/* 🔥 Logo */}
          <div className="h-16 flex items-center justify-center border-b border-[#fbb829]">
            <span className="text-[#fbb829] font-bold text-lg">ଜଗନ୍ନାଥ</span>
          </div>

          {/* 🔗 Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  // ✅ Close only on mobile
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#fbb829] text-black font-semibold"
                      : "hover:bg-[#fbb829]/20"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* 👤 User + Logout */}
          <div className="p-4 border-t border-[#fbb829]">
            <p className="text-sm text-white/80 mb-2">
              {user?.full_name || user?.username}
            </p>

            <button
              onClick={handleLogout}
              className="w-full bg-[#fbb829] text-black py-2 rounded-lg font-semibold hover:bg-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
