import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { statsAPI } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await statsAPI.getStorage();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Notifications", count: stats?.counts?.notifications || 0, link: "/admin/notifications", icon: "📢" },
    { title: "Events", count: stats?.counts?.events || 0, link: "/admin/events", icon: "🎉" },
    { title: "Gallery", count: stats?.counts?.gallery || 0, link: "/admin/gallery", icon: "🖼️" },
    { title: "PDFs", count: stats?.counts?.pdfs || 0, link: "/admin/pdfs", icon: "📄" },
  ];

  return (
    <div className="p-4 md:p-6 text-white">

      {/* 🔥 Welcome */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#fbb829]">
          Welcome, {user?.full_name || "Admin"}
        </h1>
        <p className="text-sm text-white/60">
          Manage your Jagannath devotional platform
        </p>
      </div>

      {/* 🔄 Loading */}
      {loading && (
        <div className="text-center py-10 text-[#fbb829]">
          Loading...
        </div>
      )}

      {/* 📊 Storage */}
      {!loading && stats && (
        <div className="bg-black/70 border border-[#fbb829] rounded-lg p-4 mb-6">
          <p className="text-sm mb-2">Storage</p>

          <div className="w-full h-3 bg-black rounded-full overflow-hidden">
            <div
              className="h-full bg-[#fbb829]"
              style={{ width: `${stats?.limits?.usedPercentage || 0}%` }}
            />
          </div>

          <p className="text-xs mt-2 text-white/60">
            {stats?.storage?.megabytes || 0} MB used
          </p>
        </div>
      )}

      {/* 📦 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.title} to={card.link}>
            <div className="bg-black/60 border border-[#fbb829] rounded-lg p-4 hover:bg-[#fbb829]/10 transition">

              <div className="text-2xl mb-2">{card.icon}</div>

              <p className="text-sm">{card.title}</p>

              <p className="text-xl font-bold text-[#fbb829]">
                {card.count}
              </p>

            </div>
          </Link>
        ))}
      </div>

      {/* ⚡ Quick Actions */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-[#fbb829] mb-3">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <Link to="/admin/notifications/new" className="action-card">➕ Add</Link>
          <Link to="/admin/events/new" className="action-card">📅 Event</Link>
          <Link to="/admin/gallery/upload" className="action-card">🖼️ Image</Link>
          <Link to="/admin/pdfs/upload" className="action-card">📄 PDF</Link>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
