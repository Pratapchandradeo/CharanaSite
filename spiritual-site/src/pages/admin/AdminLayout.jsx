import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";

// Import all admin pages
import AdminDashboard from "./AdminDashboard";
import AdminNotifications from "./AdminNotifications";
import AdminEvents from "./AdminEvents";
import AdminGallery from "./AdminGallery";
import AdminPDFs from "./AdminPDFs";
import AdminUsers from "./AdminUsers";
import ActivityLogs from "./ActivityLogs";
import Profile from "./Profile";
// import { useEffect } from "react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // const { user, loading: authLoading } = useAuth();

  // useEffect(() => {
  //   if (!authLoading && user) {
  //     fetchEvents();
  //   }
  // }, [authLoading, user]);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e31b23] to-black">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Header */}
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <main
        className={`
    pt-16 min-h-screen transition-all duration-300
    px-4 md:px-6
    ${sidebarOpen ? "md:ml-64" : "md:ml-20"}
  `}
      >
        <div className="bg-black/20 rounded-xl p-4 md:p-6">
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="notifications/new" element={<AdminNotifications />} />
            <Route
              path="notifications/edit/:id"
              element={<AdminNotifications />}
            />
            <Route path="events" element={<AdminEvents />} />
            <Route path="events/new" element={<AdminEvents />} />
            <Route path="events/edit/:id" element={<AdminEvents />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="gallery/upload" element={<AdminGallery />} />
            <Route path="gallery/edit/:id" element={<AdminGallery />} />
            <Route path="pdfs" element={<AdminPDFs />} />
            <Route path="pdfs/upload" element={<AdminPDFs />} />
            <Route path="pdfs/edit/:id" element={<AdminPDFs />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="activity" element={<ActivityLogs />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
