import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    date: '',
    date_en: '',
    time: '',
    time_en: '',
    description: '',
    description_en: '',
    display_order: 0,
    image: null
  });

  useEffect(() => {
    fetchEvents();
    
    if (params.id) {
      fetchEvent(params.id);
    }
  }, [params.id]);

  const fetchEvents = async () => {
    try {
      const data = await eventsAPI.getAdminAll();
      setEvents(data);
    } catch (error) {
      showMessage('error', 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvent = async (id) => {
    try {
      const data = await eventsAPI.getById(id);
      setFormData({
        title: data.title || '',
        title_en: data.title_en || '',
        date: data.date || '',
        date_en: data.date_en || '',
        time: data.time || '',
        time_en: data.time_en || '',
        description: data.description || '',
        description_en: data.description_en || '',
        display_order: data.display_order || 0,
        image: null
      });
      if (data.image_path) {
        setImagePreview(`http://localhost:5000${data.image_path}`);
      }
      setEditingId(id);
      setShowForm(true);
    } catch (error) {
      showMessage('error', 'Failed to fetch event details');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingId) {
        await eventsAPI.update(editingId, formDataToSend);
        showMessage('success', 'Event updated successfully');
      } else {
        await eventsAPI.create(formDataToSend);
        showMessage('success', 'Event created successfully');
      }
      
      resetForm();
      fetchEvents();
    } catch (error) {
      showMessage('error', error.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventsAPI.delete(id);
      showMessage('success', 'Event deleted successfully');
      fetchEvents();
    } catch (error) {
      showMessage('error', 'Failed to delete event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_en: '',
      date: '',
      date_en: '',
      time: '',
      time_en: '',
      description: '',
      description_en: '',
      display_order: 0,
      image: null
    });
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
    navigate('/admin/events');
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
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
        <h1 className="text-3xl font-bold text-[#fbb829]">Events Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#fbb829] text-black px-4 py-2 rounded-lg hover:bg-white transition"
        >
          {showForm ? 'View List' : '+ Add Event'}
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
            {editingId ? 'Edit Event' : 'Add New Event'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Odia Fields */}
              <div>
                <label className="block text-white mb-2">Title (Odia) *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                  required
                />
              </div>

              {/* English Fields */}
              <div>
                <label className="block text-white mb-2">Title (English)</label>
                <input
                  type="text"
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                />
              </div>

              {/* Date Odia */}
              <div>
                <label className="block text-white mb-2">Date (Odia) *</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="e.g., ଜୁନ ୨୦୨୬"
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                  required
                />
              </div>

              {/* Date English */}
              <div>
                <label className="block text-white mb-2">Date (English)</label>
                <input
                  type="text"
                  name="date_en"
                  value={formData.date_en}
                  onChange={handleInputChange}
                  placeholder="e.g., June 2026"
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                />
              </div>

              {/* Time Odia */}
              <div>
                <label className="block text-white mb-2">Time (Odia) *</label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  placeholder="e.g., ସକାଳ ୬ଟା"
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                  required
                />
              </div>

              {/* Time English */}
              <div>
                <label className="block text-white mb-2">Time (English)</label>
                <input
                  type="text"
                  name="time_en"
                  value={formData.time_en}
                  onChange={handleInputChange}
                  placeholder="e.g., 6:00 AM"
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                />
              </div>
            </div>

            {/* Description Odia */}
            <div>
              <label className="block text-white mb-2">Description (Odia) *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                required
              />
            </div>

            {/* Description English */}
            <div>
              <label className="block text-white mb-2">Description (English)</label>
              <textarea
                name="description_en"
                value={formData.description_en}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-white mb-2">Display Order</label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-white mb-2">Event Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#fbb829] file:text-black hover:file:bg-white"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Preview" className="h-32 w-auto rounded-lg" />
                </div>
              )}
            </div>

            {/* Form Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#fbb829] text-black px-6 py-2 rounded-lg hover:bg-white transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update Event' : 'Create Event')}
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
        /* Events List */
        <div className="bg-black/40 border border-[#fbb829] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#fbb829]/20">
              <tr>
                <th className="px-6 py-3 text-left text-[#fbb829]">ID</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Image</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Title</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Date</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Time</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Status</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fbb829]/20">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-[#fbb829]/5">
                  <td className="px-6 py-4 text-white">{event.id}</td>
                  <td className="px-6 py-4">
                    {event.image_path ? (
                      <img 
                        src={`http://localhost:5000${event.image_path}`} 
                        alt={event.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-black/40 border border-[#fbb829] rounded flex items-center justify-center text-[#fbb829]">
                        🖼️
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">{event.title}</div>
                    <div className="text-white/60 text-sm">{event.title_en}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">{event.date}</div>
                    <div className="text-white/60 text-sm">{event.date_en}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">{event.time}</div>
                    <div className="text-white/60 text-sm">{event.time_en}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      event.is_active 
                        ? 'bg-green-600/20 text-green-500' 
                        : 'bg-red-600/20 text-red-500'
                    }`}>
                      {event.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                        className="text-blue-500 hover:text-blue-400"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-white/60">
                    No events found. Click "Add Event" to create one.
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

export default AdminEvents;