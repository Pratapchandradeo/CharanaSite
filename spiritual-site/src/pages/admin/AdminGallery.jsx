import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { galleryAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showArchived, setShowArchived] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    display_order: 0,
    image: null
  });

  useEffect(() => {
    // Check URL for archived param
    const searchParams = new URLSearchParams(location.search);
    setShowArchived(searchParams.get('archived') === 'true');
    
    fetchImages();
    
    if (params.id) {
      fetchImage(params.id);
    }
  }, [location.search, params.id]);

  const fetchImages = async () => {
    try {
      const data = showArchived 
        ? await galleryAPI.getAdminAll() // Get all including archived for admin
        : await galleryAPI.getAll(); // Get only active
      setImages(data);
    } catch (error) {
      showMessage('error', 'Failed to fetch images'+error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImage = async (id) => {
    try {
      const data = await galleryAPI.getById(id);
      setFormData({
        title: data.title || '',
        title_en: data.title_en || '',
        display_order: data.display_order || 0,
        image: null
      });
      if (data.image_path) {
        setImagePreview(`http://localhost:5000${data.image_path}`);
      }
      setEditingId(id);
      setShowUploadForm(true);
    } catch (error) {
      showMessage('error', 'Failed to fetch image details'+error);
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
      if (editingId) {
        // For updates, only send metadata if no new image
        if (!formData.image) {
          await galleryAPI.update(editingId, {
            title: formData.title,
            title_en: formData.title_en,
            display_order: formData.display_order
          });
        } else {
          // If there's a new image, use FormData
          const formDataToSend = new FormData();
          formDataToSend.append('title', formData.title);
          formDataToSend.append('title_en', formData.title_en);
          formDataToSend.append('display_order', formData.display_order);
          formDataToSend.append('image', formData.image);
          
          await galleryAPI.update(editingId, formDataToSend);
        }
        showMessage('success', 'Image updated successfully');
      } else {
        // New upload
        if (!formData.image) {
          showMessage('error', 'Please select an image');
          setLoading(false);
          return;
        }
        
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('title_en', formData.title_en);
        formDataToSend.append('display_order', formData.display_order);
        formDataToSend.append('image', formData.image);
        
        await galleryAPI.upload(formDataToSend);
        showMessage('success', 'Image uploaded successfully');
      }
      
      resetForm();
      fetchImages();
    } catch (error) {
      showMessage('error', error.message || 'Failed to save image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await galleryAPI.delete(id);
      showMessage('success', 'Image deleted successfully');
      fetchImages();
    } catch (error) {
      showMessage('error', 'Failed to delete image'+error);
    }
  };

  const handleArchive = async () => {
    if (!window.confirm('Archive old images (older than 90 days with low views)?')) return;

    try {
      const result = await galleryAPI.archive();
      showMessage('success', `Archived ${result.archivedCount} images`);
      fetchImages();
    } catch (error) {
      showMessage('error', 'Failed to archive images'+error);
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm('Restore this image from archive?')) return;

    try {
      await galleryAPI.restore(id);
      showMessage('success', 'Image restored successfully');
      fetchImages();
    } catch (error) {
      showMessage('error', 'Failed to restore image'+error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_en: '',
      display_order: 0,
      image: null
    });
    setImagePreview(null);
    setEditingId(null);
    setShowUploadForm(false);
    navigate('/admin/gallery');
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getImageUrl = (path) => {
    return path ? `http://localhost:5000${path}` : null;
  };

  if (loading && !showUploadForm) {
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
        <h1 className="text-3xl font-bold text-[#fbb829]">
          {showArchived ? 'Archived Gallery' : 'Gallery Management'}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="border border-[#fbb829] text-white px-4 py-2 rounded-lg hover:bg-[#fbb829]/20 transition"
          >
            {showArchived ? '📸 Show Active' : '📦 Show Archived'}
          </button>
          {!showArchived && (
            <>
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="bg-[#fbb829] text-black px-4 py-2 rounded-lg hover:bg-white transition"
              >
                {showUploadForm ? 'View Gallery' : '+ Upload Image'}
              </button>
              {user?.role === 'super_admin' && (
                <button
                  onClick={handleArchive}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  📦 Archive Old Images
                </button>
              )}
            </>
          )}
        </div>
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

      {/* Upload Form */}
      {showUploadForm && !showArchived && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 border border-[#fbb829] rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-[#fbb829] mb-4">
            {editingId ? 'Edit Image Details' : 'Upload New Image'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Odia Title */}
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

              {/* English Title */}
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
            {!editingId && (
              <div>
                <label className="block text-white mb-2">Select Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#fbb829] file:text-black hover:file:bg-white"
                  required={!editingId}
                />
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <label className="block text-white mb-2">Preview</label>
                <img src={imagePreview} alt="Preview" className="h-48 w-auto rounded-lg border-2 border-[#fbb829]" />
              </div>
            )}

            {/* Form Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#fbb829] text-black px-6 py-2 rounded-lg hover:bg-white transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update Details' : 'Upload Image')}
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
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-black/40 border border-[#fbb829] rounded-xl overflow-hidden group"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={getImageUrl(image.thumbnail_path || image.image_path)} 
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Status Badges */}
              <div className="absolute top-2 right-2 flex gap-2">
                {image.is_archived && (
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                    Archived
                  </span>
                )}
                {!image.is_active && (
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                    Inactive
                  </span>
                )}
              </div>

              {/* View Count */}
              <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                👁️ {image.access_count || 0} views
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <h3 className="text-[#fbb829] font-semibold mb-1">{image.title}</h3>
              {image.title_en && (
                <p className="text-white/60 text-sm mb-2">{image.title_en}</p>
              )}
              
              {/* Meta Info */}
              <div className="text-xs text-white/40 space-y-1 mb-3">
                <p>📅 Uploaded: {new Date(image.uploaded_at).toLocaleDateString()}</p>
                {image.last_accessed && (
                  <p>👁️ Last viewed: {new Date(image.last_accessed).toLocaleDateString()}</p>
                )}
                {image.archived_at && (
                  <p>📦 Archived: {new Date(image.archived_at).toLocaleDateString()}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!image.is_archived ? (
                  <>
                    <button
                      onClick={() => navigate(`/admin/gallery/edit/${image.id}`)}
                      className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleRestore(image.id)}
                      className="flex-1 bg-green-600 text-white py-1 rounded hover:bg-green-700 transition text-sm"
                    >
                      Restore
                    </button>
                    {user?.role === 'super_admin' && (
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {images.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-white/60">
              {showArchived 
                ? 'No archived images found.' 
                : 'No images found. Click "Upload Image" to add one.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;