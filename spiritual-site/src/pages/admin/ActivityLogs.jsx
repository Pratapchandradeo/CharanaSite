import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    entityType: 'all',
    action: 'all',
    dateRange: '7'
  });
  const [stats, setStats] = useState({
    total: 0,
    byAction: {},
    byEntity: {}
  });
  
  const { token } = useAuth();

  const entityTypes = [
    { value: 'all', label: 'All Entities' },
    { value: 'admin_users', label: 'Admin Users' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'events', label: 'Events' },
    { value: 'gallery_images', label: 'Gallery' },
    { value: 'pdf_documents', label: 'PDFs' }
  ];

  const actionTypes = [
    { value: 'all', label: 'All Actions' },
    { value: 'CREATE', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' },
    { value: 'LOGIN_SUCCESS', label: 'Login' },
    { value: 'LOGOUT', label: 'Logout' },
    { value: 'CHANGE_PASSWORD', label: 'Password Change' },
    { value: 'RESET_PASSWORD', label: 'Password Reset' },
    { value: 'UPLOAD', label: 'Upload' },
    { value: 'ARCHIVE', label: 'Archive' },
    { value: 'RESTORE', label: 'Restore'
    }
  ];

  const dateRanges = [
    { value: '1', label: 'Last 24 Hours' },
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: '365', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filter.entityType !== 'all') params.append('entityType', filter.entityType);
      if (filter.action !== 'all') params.append('action', filter.action);
      if (filter.dateRange !== 'all') params.append('days', filter.dateRange);

      const response = await fetch(`http://localhost:5000/api/logs?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.logs);
        calculateStats(data.logs);
      } else {
        console.error('Failed to fetch logs:', data.error);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (logsData) => {
    const byAction = {};
    const byEntity = {};
    
    logsData.forEach(log => {
      // Count by action
      byAction[log.action] = (byAction[log.action] || 0) + 1;
      
      // Count by entity
      byEntity[log.entity_type] = (byEntity[log.entity_type] || 0) + 1;
    });

    setStats({
      total: logsData.length,
      byAction,
      byEntity
    });
  };

  const getActionBadge = (action) => {
    const colors = {
      'CREATE': 'bg-green-600/20 text-green-500',
      'UPDATE': 'bg-blue-600/20 text-blue-500',
      'DELETE': 'bg-red-600/20 text-red-500',
      'LOGIN_SUCCESS': 'bg-purple-600/20 text-purple-500',
      'LOGOUT': 'bg-gray-600/20 text-gray-500',
      'CHANGE_PASSWORD': 'bg-yellow-600/20 text-yellow-500',
      'RESET_PASSWORD': 'bg-orange-600/20 text-orange-500',
      'UPLOAD': 'bg-indigo-600/20 text-indigo-500',
      'ARCHIVE': 'bg-pink-600/20 text-pink-500',
      'RESTORE': 'bg-teal-600/20 text-teal-500'
    };
    return colors[action] || 'bg-gray-600/20 text-gray-500';
  };

  const getEntityIcon = (entityType) => {
    const icons = {
      'admin_users': '👤',
      'notifications': '📢',
      'events': '🎉',
      'gallery_images': '🖼️',
      'pdf_documents': '📄'
    };
    return icons[entityType] || '📝';
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilter({
      entityType: 'all',
      action: 'all',
      dateRange: '7'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#fbb829] mb-2">Activity Logs</h1>
        <p className="text-white/60">Track all administrative actions in the system</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-black/40 border border-[#fbb829] rounded-xl p-4">
          <p className="text-white/60 text-sm">Total Logs</p>
          <p className="text-3xl font-bold text-[#fbb829]">{stats.total}</p>
        </div>
        <div className="bg-black/40 border border-[#fbb829] rounded-xl p-4">
          <p className="text-white/60 text-sm">Actions</p>
          <p className="text-3xl font-bold text-[#fbb829]">{Object.keys(stats.byAction).length}</p>
        </div>
        <div className="bg-black/40 border border-[#fbb829] rounded-xl p-4">
          <p className="text-white/60 text-sm">Entities</p>
          <p className="text-3xl font-bold text-[#fbb829]">{Object.keys(stats.byEntity).length}</p>
        </div>
        <div className="bg-black/40 border border-[#fbb829] rounded-xl p-4">
          <p className="text-white/60 text-sm">Most Active</p>
          <p className="text-lg font-bold text-[#fbb829] truncate">
            {Object.entries(stats.byAction).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A'}
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/40 border border-[#fbb829] rounded-xl p-6 mb-6"
      >
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-white/60 text-sm mb-1">Entity Type</label>
            <select
              name="entityType"
              value={filter.entityType}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
            >
              {entityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-white/60 text-sm mb-1">Action</label>
            <select
              name="action"
              value={filter.action}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
            >
              {actionTypes.map(action => (
                <option key={action.value} value={action.value}>{action.label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-white/60 text-sm mb-1">Date Range</label>
            <select
              name="dateRange"
              value={filter.dateRange}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchLogs}
              className="bg-[#fbb829] text-black px-6 py-2 rounded-lg hover:bg-white transition"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="border border-[#fbb829] text-white px-6 py-2 rounded-lg hover:bg-[#fbb829]/20 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </motion.div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/40 border border-[#fbb829] rounded-xl overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-center">
              <div className="w-12 h-12 border-4 border-[#fbb829] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#fbb829]">Loading logs...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#fbb829]/20">
                <tr>
                  <th className="px-6 py-3 text-left text-[#fbb829] text-sm">Time</th>
                  <th className="px-6 py-3 text-left text-[#fbb829] text-sm">User</th>
                  <th className="px-6 py-3 text-left text-[#fbb829] text-sm">Action</th>
                  <th className="px-6 py-3 text-left text-[#fbb829] text-sm">Entity</th>
                  <th className="px-6 py-3 text-left text-[#fbb829] text-sm">Details</th>
                  <th className="px-6 py-3 text-left text-[#fbb829] text-sm">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#fbb829]/20">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#fbb829]/5">
                    <td className="px-6 py-4 text-white/80 text-sm whitespace-nowrap">
                      {formatDateTime(log.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{log.username || 'System'}</div>
                      {log.full_name && (
                        <div className="text-white/60 text-xs">{log.full_name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getEntityIcon(log.entity_type)}</span>
                        <span className="text-white/80 text-sm capitalize">
                          {log.entity_type.replace('_', ' ')}
                        </span>
                      </div>
                      {log.entity_id && (
                        <div className="text-white/40 text-xs ml-6">ID: {log.entity_id}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {log.old_values || log.new_values ? (
                        <div className="relative group">
                          <button className="text-blue-500 hover:text-blue-400 text-sm">
                            View Changes
                          </button>
                          <div className="absolute left-0 top-full mt-2 w-80 bg-black/90 border border-[#fbb829] rounded-lg p-3 hidden group-hover:block z-50">
                            {log.old_values && (
                              <div className="mb-2">
                                <p className="text-red-500 text-xs mb-1">Before:</p>
                                <pre className="text-white/60 text-xs whitespace-pre-wrap">
                                  {JSON.stringify(JSON.parse(log.old_values), null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.new_values && (
                              <div>
                                <p className="text-green-500 text-xs mb-1">After:</p>
                                <pre className="text-white/60 text-xs whitespace-pre-wrap">
                                  {JSON.stringify(JSON.parse(log.new_values), null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-white/40 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white/40 text-sm font-mono">
                      {log.ip_address || 'N/A'}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-white/60">
                      No activity logs found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Summary Section */}
      {Object.keys(stats.byAction).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Action Breakdown */}
          <div className="bg-black/40 border border-[#fbb829] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#fbb829] mb-4">Actions Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(stats.byAction).map(([action, count]) => (
                <div key={action} className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs ${getActionBadge(action)}`}>
                    {action}
                  </span>
                  <span className="text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Entity Breakdown */}
          <div className="bg-black/40 border border-[#fbb829] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#fbb829] mb-4">Entities Affected</h3>
            <div className="space-y-2">
              {Object.entries(stats.byEntity).map(([entity, count]) => (
                <div key={entity} className="flex items-center justify-between">
                  <span className="text-white capitalize flex items-center gap-2">
                    <span className="text-xl">{getEntityIcon(entity)}</span>
                    {entity.replace('_', ' ')}
                  </span>
                  <span className="text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ActivityLogs;