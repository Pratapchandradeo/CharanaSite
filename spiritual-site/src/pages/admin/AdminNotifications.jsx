import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { notificationsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth'; // Fixed import

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    message: '',
    type: 'update',
    display_order: 0
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const notificationTypes = [
    { value: 'seva', label: 'Seva', color: 'yellow' },
    { value: 'update', label: 'Update', color: 'red' },
    { value: 'bhajan', label: 'Bhajan', color: 'white' },
    { value: 'special', label: 'Special', color: 'yellow' },
    { value: 'festival', label: 'Festival', color: 'red' }
  ];

  useEffect(() => {
    fetchNotifications();
    
    if (params.id) {
      fetchNotification(params.id);
    }
  }, [params.id]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getAdminAll();
      setNotifications(data);
    } catch (error) {
      showMessage('error', 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotification = async (id) => {
    try {
      const data = await notificationsAPI.getById(id);
      setFormData({
        message: data.message,
        type: data.type,
        display_order: data.display_order || 0
      });
      setEditingId(id);
      setShowForm(true);
    } catch (error) {
      showMessage('error', 'Failed to fetch notification details');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await notificationsAPI.update(editingId, formData);
        showMessage('success', 'Notification updated successfully');
      } else {
        await notificationsAPI.create(formData);
        showMessage('success', 'Notification created successfully');
      }
      
      resetForm();
      fetchNotifications();
    } catch (error) {
      showMessage('error', error.message || 'Failed to save notification');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;

    try {
      await notificationsAPI.delete(id);
      showMessage('success', 'Notification deleted successfully');
      fetchNotifications();
    } catch (error) {
      showMessage('error', 'Failed to delete notification');
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('Permanently delete? This cannot be undone!')) return;

    try {
      await notificationsAPI.permanentDelete(id);
      showMessage('success', 'Notification permanently deleted');
      fetchNotifications();
    } catch (error) {
      showMessage('error', 'Failed to delete notification');
    }
  };

  const resetForm = () => {
    setFormData({
      message: '',
      type: 'update',
      display_order: 0
    });
    setEditingId(null);
    setShowForm(false);
    navigate('/admin/notifications');
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getTypeBadge = (type) => {
    const t = notificationTypes.find(t => t.value === type);
    return t ? t.label : type;
  };

  if (loading && !showForm) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-[#fbb829] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#fbb829]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#fbb829]">Notifications Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#fbb829] text-black px-4 py-2 rounded-lg hover:bg-white transition"
        >
          {showForm ? 'View List' : '+ Add Notification'}
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-600/20 border border-green-600 text-green-500' :
          'bg-red-600/20 border border-red-600 text-red-500'
        }`}>
          {message.text}
        </div>
      )}

      {/* Form */}
      {showForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 border border-[#fbb829] rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-[#fbb829] mb-4">
            {editingId ? 'Edit Notification' : 'Add New Notification'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Message (Odia/English)</label>
              <input
                type="text"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
              >
                {notificationTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Display Order</label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                min="0"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#fbb829] text-black px-6 py-2 rounded-lg hover:bg-white transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update' : 'Create')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="border border-[#fbb829] text-white px-6 py-2 rounded-lg hover:bg-[#fbb829]/20 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        /* Notifications List */
        <div className="bg-black/40 border border-[#fbb829] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#fbb829]/20">
              <tr>
                <th className="px-6 py-3 text-left text-[#fbb829]">ID</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Message</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Type</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Order</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Status</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Created</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fbb829]/20">
              {notifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-[#fbb829]/5">
                  <td className="px-6 py-4 text-white">{notif.id}</td>
                  <td className="px-6 py-4 text-white max-w-md truncate">{notif.message}</td>
                  <td className="px-6 py-4">
                    <span className="bg-[#fbb829]/20 text-[#fbb829] px-2 py-1 rounded text-sm">
                      {getTypeBadge(notif.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">{notif.display_order || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      notif.is_active 
                        ? 'bg-green-600/20 text-green-500' 
                        : 'bg-red-600/20 text-red-500'
                    }`}>
                      {notif.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/60 text-sm">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/notifications/edit/${notif.id}`)}
                        className="text-blue-500 hover:text-blue-400"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Soft Delete"
                      >
                        🗑️
                      </button>
                      {user?.role === 'super_admin' && (
                        <button
                          onClick={() => handlePermanentDelete(notif.id)}
                          className="text-red-700 hover:text-red-600"
                          title="Permanent Delete"
                        >
                          ⚠️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-white/60">
                    No notifications found. Click "Add Notification" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;