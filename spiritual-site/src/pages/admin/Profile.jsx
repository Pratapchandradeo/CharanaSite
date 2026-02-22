import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user, token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_no: '',
    address: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        mobile_no: user.mobile_no || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/admin-users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Profile updated successfully');
        // Update local user data if needed
      } else {
        showMessage('error', data.error || 'Update failed');
      }
    } catch (error) {
      showMessage('error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowChangePassword(false);
      } else {
        showMessage('error', data.error || 'Password change failed');
      }
    } catch (error) {
      showMessage('error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  if (!user) {
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#fbb829] mb-2">My Profile</h1>
          <p className="text-white/60">Manage your personal information and security settings</p>
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

        {/* Profile Info Card */}
        <div className="bg-black/40 border border-[#fbb829] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-[#fbb829] rounded-full flex items-center justify-center text-black text-3xl font-bold">
              {user.full_name?.charAt(0) || user.username.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.full_name || user.username}</h2>
              <p className="text-[#fbb829]">@{user.username}</p>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  user.role === 'master_admin' 
                    ? 'bg-purple-600/20 text-purple-500' 
                    : 'bg-blue-600/20 text-blue-500'
                }`}>
                  {user.role === 'master_admin' ? 'Master Admin' : 'Admin'}
                </span>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="border-t border-[#fbb829]/20 pt-4">
            <h3 className="text-lg font-semibold text-[#fbb829] mb-3">Your Permissions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {user.permissions?.admins && (
                <div className="bg-green-600/20 text-green-500 px-3 py-1 rounded-full text-sm text-center">
                  ✓ Manage Admins
                </div>
              )}
              {user.permissions?.events && (
                <div className="bg-green-600/20 text-green-500 px-3 py-1 rounded-full text-sm text-center">
                  ✓ Manage Events
                </div>
              )}
              {user.permissions?.gallery && (
                <div className="bg-green-600/20 text-green-500 px-3 py-1 rounded-full text-sm text-center">
                  ✓ Manage Gallery
                </div>
              )}
              {user.permissions?.pdfs && (
                <div className="bg-green-600/20 text-green-500 px-3 py-1 rounded-full text-sm text-center">
                  ✓ Manage PDFs
                </div>
              )}
              {user.permissions?.notifications && (
                <div className="bg-green-600/20 text-green-500 px-3 py-1 rounded-full text-sm text-center">
                  ✓ Manage Notifications
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-black/40 border border-[#fbb829] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#fbb829] mb-4">Edit Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                />
              </div>

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

              <div className="md:col-span-2">
                <label className="block text-white mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#fbb829] text-black px-6 py-2 rounded-lg hover:bg-white transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="bg-black/40 border border-[#fbb829] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#fbb829]">Security</h2>
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="text-[#fbb829] hover:text-white transition"
            >
              {showChangePassword ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showChangePassword && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleChangePassword}
              className="space-y-4"
            >
              <div>
                <label className="block text-white mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                  required
                  minLength="6"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#fbb829] text-black px-6 py-2 rounded-lg hover:bg-white transition disabled:opacity-50"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </motion.form>
          )}

          {/* Account Info */}
          <div className="mt-4 pt-4 border-t border-[#fbb829]/20 text-sm text-white/60">
            <p>Member since: {new Date(user.created_at).toLocaleDateString()}</p>
            <p>Last login: {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;