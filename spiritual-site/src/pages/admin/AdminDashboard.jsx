import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { statsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth'; // Fixed import

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
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Notifications',
      count: stats?.counts?.notifications || 0,
      icon: '📢',
      link: '/admin/notifications',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Events',
      count: stats?.counts?.events || 0,
      icon: '🎉',
      link: '/admin/events',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Gallery Images',
      count: stats?.counts?.gallery || 0,
      icon: '🖼️',
      link: '/admin/gallery',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'PDF Documents',
      count: stats?.counts?.pdfs || 0,
      icon: '📄',
      link: '/admin/pdfs',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Archived Images',
      count: stats?.counts?.archived || 0,
      icon: '📦',
      link: '/admin/gallery?archived=true',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#fbb829] mb-2">
          Welcome, {user?.full_name || 'Admin'}!
        </h1>
        <p className="text-white/60">Manage your Jagannath Temple website content</p>
      </motion.div>

      {/* Storage Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/40 border border-[#fbb829] rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-[#fbb829] mb-4">Storage Usage</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-white">
              <span>Used: {stats.storage.megabytes} MB</span>
              <span>Total: 500 MB</span>
            </div>
            <div className="w-full h-4 bg-black/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#fbb829] to-[#e31b23]"
                style={{ width: `${stats.limits.usedPercentage}%` }}
              />
            </div>
            <p className="text-sm text-white/60">
              {stats.limits.usedPercentage}% of storage used
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Link to={card.link}>
              <div className={`bg-gradient-to-br ${card.color} rounded-xl p-6 hover:scale-105 transition-transform`}>
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-3xl font-bold text-white">{card.count}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <h2 className="text-xl font-semibold text-[#fbb829] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/notifications/new">
            <div className="bg-black/40 border border-[#fbb829] rounded-lg p-4 text-center hover:bg-[#fbb829]/20 transition">
              <span className="text-2xl block mb-2">➕</span>
              <span className="text-white">Add Notification</span>
            </div>
          </Link>
          <Link to="/admin/events/new">
            <div className="bg-black/40 border border-[#fbb829] rounded-lg p-4 text-center hover:bg-[#fbb829]/20 transition">
              <span className="text-2xl block mb-2">📅</span>
              <span className="text-white">Add Event</span>
            </div>
          </Link>
          <Link to="/admin/gallery/upload">
            <div className="bg-black/40 border border-[#fbb829] rounded-lg p-4 text-center hover:bg-[#fbb829]/20 transition">
              <span className="text-2xl block mb-2">🖼️</span>
              <span className="text-white">Upload Image</span>
            </div>
          </Link>
          <Link to="/admin/pdfs/upload">
            <div className="bg-black/40 border border-[#fbb829] rounded-lg p-4 text-center hover:bg-[#fbb829]/20 transition">
              <span className="text-2xl block mb-2">📄</span>
              <span className="text-white">Upload PDF</span>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;