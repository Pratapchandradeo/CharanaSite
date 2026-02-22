import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    mobile_no: '',
    address: '',
    role: 'admin',
    can_manage_admins: false,
    can_manage_events: true,
    can_manage_gallery: true,
    can_manage_pdfs: true,
    can_manage_notifications: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin-users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      showMessage('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId 
        ? `http://localhost:5000/api/admin-users/${editingId}`
        : 'http://localhost:5000/api/admin-users';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', editingId ? 'User updated successfully' : 'User created successfully');
        resetForm();
        fetchUsers();
      } else {
        showMessage('error', data.error || 'Operation failed');
      }
    } catch (error) {
      showMessage('error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username,
      password: '',
      full_name: user.full_name || '',
      mobile_no: user.mobile_no || '',
      address: user.address || '',
      role: user.role,
      can_manage_admins: user.can_manage_admins === 1,
      can_manage_events: user.can_manage_events === 1,
      can_manage_gallery: user.can_manage_gallery === 1,
      can_manage_pdfs: user.can_manage_pdfs === 1,
      can_manage_notifications: user.can_manage_notifications === 1
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin-users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'User deleted successfully');
        fetchUsers();
      } else {
        showMessage('error', data.error || 'Delete failed');
      }
    } catch (error) {
      showMessage('error', 'Network error');
    }
  };

  const handleResetPassword = async (id, username) => {
    const newPassword = prompt(`Enter new password for ${username}:`, '');
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin-users/${id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Password reset successfully');
      } else {
        showMessage('error', data.error || 'Password reset failed');
      }
    } catch (error) {
      showMessage('error', 'Network error');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      full_name: '',
      mobile_no: '',
      address: '',
      role: 'admin',
      can_manage_admins: false,
      can_manage_events: true,
      can_manage_gallery: true,
      can_manage_pdfs: true,
      can_manage_notifications: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'master_admin':
        return <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Master Admin</span>;
      case 'admin':
        return <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Admin</span>;
      default:
        return <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs">{role}</span>;
    }
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
        <h1 className="text-3xl font-bold text-[#fbb829]">Admin Users Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#fbb829] text-black px-4 py-2 rounded-lg hover:bg-white transition"
        >
          {showForm ? 'View List' : '+ Add New Admin'}
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
            {editingId ? 'Edit Admin User' : 'Create New Admin User'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username */}
              <div>
                <label className="block text-white mb-2">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                  required
                  disabled={editingId}
                />
              </div>

              {/* Password (only for new users) */}
              {!editingId && (
                <div>
                  <label className="block text-white mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                    required={!editingId}
                    minLength="6"
                  />
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-white mb-2">Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-white mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile_no"
                  value={formData.mobile_no}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-white mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-white mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                >
                  <option value="admin">Admin</option>
                  <option value="master_admin">Master Admin</option>
                </select>
              </div>
            </div>

            {/* Permissions Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#fbb829] mb-3">Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3 text-white">
                  <input
                    type="checkbox"
                    name="can_manage_admins"
                    checked={formData.can_manage_admins}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>Manage Admins</span>
                </label>

                <label className="flex items-center space-x-3 text-white">
                  <input
                    type="checkbox"
                    name="can_manage_events"
                    checked={formData.can_manage_events}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>Manage Events</span>
                </label>

                <label className="flex items-center space-x-3 text-white">
                  <input
                    type="checkbox"
                    name="can_manage_gallery"
                    checked={formData.can_manage_gallery}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>Manage Gallery</span>
                </label>

                <label className="flex items-center space-x-3 text-white">
                  <input
                    type="checkbox"
                    name="can_manage_pdfs"
                    checked={formData.can_manage_pdfs}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>Manage PDFs</span>
                </label>

                <label className="flex items-center space-x-3 text-white">
                  <input
                    type="checkbox"
                    name="can_manage_notifications"
                    checked={formData.can_manage_notifications}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>Manage Notifications</span>
                </label>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#fbb829] text-black px-6 py-2 rounded-lg hover:bg-white transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update User' : 'Create User')}
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
        /* Users List */
        <div className="bg-black/40 border border-[#fbb829] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#fbb829]/20">
              <tr>
                <th className="px-6 py-3 text-left text-[#fbb829]">ID</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Username</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Full Name</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Mobile</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Role</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Status</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Last Login</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fbb829]/20">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#fbb829]/5">
                  <td className="px-6 py-4 text-white">{u.id}</td>
                  <td className="px-6 py-4 text-white">{u.username}</td>
                  <td className="px-6 py-4 text-white">{u.full_name || '-'}</td>
                  <td className="px-6 py-4 text-white">{u.mobile_no || '-'}</td>
                  <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      u.is_active 
                        ? 'bg-green-600/20 text-green-500' 
                        : 'bg-red-600/20 text-red-500'
                    }`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/60 text-sm">
                    {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-blue-500 hover:text-blue-400"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleResetPassword(u.id, u.username)}
                        className="text-yellow-500 hover:text-yellow-400"
                        title="Reset Password"
                      >
                        🔑
                      </button>
                      {u.username !== 'masteradmin' && u.role !== 'master_admin' && (
                        <button
                          onClick={() => handleDelete(u.id, u.username)}
                          className="text-red-500 hover:text-red-400"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-white/60">
                    No users found. Click "Add New Admin" to create one.
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

export default AdminUsers;