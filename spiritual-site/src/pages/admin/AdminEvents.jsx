import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { eventsAPI } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    contact: "",
    display_order: 0,
    image: null,
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
      showMessage("error", "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvent = async (id) => {
    try {
      const data = await eventsAPI.getById(id);
      setFormData({
        title: data.title || '',
        date: data.date || '',
        time: data.time || '',
        description: data.description || '',
        contact: data.contact || '',
        display_order: data.display_order || 0,
        image: null
      });
      
      if (data.image_path) {
        setImagePreview(`http://localhost:5000${data.image_path}`);
      }
      setEditingId(id);
      setShowForm(true);
    } catch (error) {
      showMessage("error", "Failed to fetch event details");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "image" && formData[key]) {
          formDataToSend.append("image", formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingId) {
        await eventsAPI.update(editingId, formDataToSend);
        showMessage("success", "Event updated successfully");
      } else {
        await eventsAPI.create(formDataToSend);
        showMessage("success", "Event created successfully");
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      showMessage("error", error.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await eventsAPI.delete(id);
      showMessage("success", "Event deleted successfully");
      fetchEvents();
    } catch (error) {
      showMessage("error", "Failed to delete event");
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      description: '',
      contact: '',
      display_order: 0,
      image: null
    });
    
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
    navigate("/admin/events");
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
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
    <div className="p-4 md:p-6 text-white">
      {/* 🔥 Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#fbb829]">
          Events Management
        </h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#fbb829] text-black px-4 py-2 rounded-lg text-sm font-semibold"
        >
          {showForm ? "View List" : "+ Add Event"}
        </button>
      </div>

      {/* 🔔 Message */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-600/20 text-green-400 border border-green-600"
              : "bg-red-600/20 text-red-400 border border-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ================= FORM ================= */}
      {showForm ? (
        <div className="bg-black/70 border border-[#fbb829] rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-semibold text-[#fbb829] mb-4">
            {editingId ? "Edit Event" : "Add Event"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                className="input"
                required
              />

              <input
                name="date"
                placeholder="Date"
                value={formData.date}
                onChange={handleInputChange}
                className="input"
                required
              />

              <input
                name="time"
                placeholder="Time"
                value={formData.time}
                onChange={handleInputChange}
                className="input"
                required
              />

              <input
                name="contact"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={handleInputChange}
                className="input"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>

            {/* Image */}
            <input type="file" onChange={handleImageChange} className="input" />

            {imagePreview && (
              <img src={imagePreview} className="h-28 rounded" />
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button className="btn-primary">
                {editingId ? "Update" : "Create"}
              </button>

              <button type="button" onClick={resetForm} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ================= LIST (FIXED MOBILE) ================= */
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-black/70 border border-[#fbb829] rounded-lg p-4"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-16 h-16 flex-shrink-0">
                  {event.image_path ? (
                    <img
                      src={`http://localhost:5000${event.image_path}`}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-black border border-[#fbb829] flex items-center justify-center">
                      🖼️
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-xs text-white/60">{event.title_en}</p>

                  <p className="text-sm mt-1">
                    {event.date} | {event.time}
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      event.is_active
                        ? "bg-green-600/20 text-green-400"
                        : "bg-red-600/20 text-red-400"
                    }`}
                  >
                    {event.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                  >
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(event.id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <p className="text-center text-white/60">No events found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
