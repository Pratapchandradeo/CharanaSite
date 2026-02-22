import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  // 🔥 Dynamic Page Title
  const getTitle = () => {
    if (location.pathname.includes("dashboard")) return "Dashboard";
    if (location.pathname.includes("notifications")) return "Notifications";
    if (location.pathname.includes("events")) return "Events";
    if (location.pathname.includes("gallery")) return "Gallery";
    if (location.pathname.includes("pdfs")) return "Documents";
    return "";
  };

  return (
    <header
      className={`fixed top-0 right-0 z-40 h-16 transition-all duration-300
      ${sidebarOpen ? "left-64" : "left-0"}`}
    >
      {/* 🔴 Background */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md border-b border-[#fbb829]" />

      <div className="relative z-10 h-full px-4 md:px-6 flex items-center justify-between text-white">
        {/* 🔹 Left */}
        <div className="flex items-center gap-3">
          {/* ☰ Toggle */}
          <button
            onClick={toggleSidebar}
            className="text-[#fbb829] p-2 rounded-lg hover:bg-[#fbb829]/20"
          >
            ☰
          </button>

          {/* Title */}
          <h2 className="font-semibold text-sm md:text-base">{getTitle()}</h2>
        </div>

        {/* 🔹 Right */}
        <div className="flex items-center gap-3">
          {/* 🌐 View Site */}
          <Link
            to="/"
            target="_blank"
            className="hidden md:block text-white hover:text-[#fbb829]"
          >
            🌐
          </Link>

          {/* 👤 User */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#fbb829]/20"
            >
              <div className="w-8 h-8 bg-[#fbb829] text-black rounded-full flex items-center justify-center font-bold">
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || "A"}
              </div>

              <span className="hidden md:block text-sm">
                {user?.full_name || user?.username}
              </span>
            </button>

            {/* 🔻 Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-black border border-[#fbb829] rounded-lg shadow-lg overflow-hidden">
                <div className="p-3 border-b border-[#fbb829]/20 text-sm">
                  <p className="text-white font-semibold">
                    {user?.full_name || user?.username}
                  </p>
                  <p className="text-[#fbb829] text-xs capitalize">
                    {user?.role}
                  </p>
                </div>

                <Link
                  to="/admin/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 hover:bg-[#fbb829]/20"
                >
                  Profile
                </Link>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-600/20"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
