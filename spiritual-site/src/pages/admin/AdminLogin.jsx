import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth'; // Fixed import

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e31b23] to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/60 border-2 border-[#fbb829] rounded-xl p-8 max-w-md w-full"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 relative">
            <svg viewBox="0 0 100 100" className="text-[#fbb829]">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none"/>
              <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="3" fill="none"/>
              <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="3" fill="none"/>
              <path d="M50 5V95M5 50H95M50 50L75 25M50 50L75 75M50 50L25 25M50 50L25 75" 
                    stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-[#fbb829] mb-2">ଜୟ ଜଗନ୍ନାଥ</h1>
        <p className="text-white/60 text-center mb-8">Admin Login</p>

        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-500 px-4 py-2 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-[#fbb829] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fbb829]"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-[#fbb829] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fbb829]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#fbb829] text-black rounded-lg font-semibold hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login to Admin Panel'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;