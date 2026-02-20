import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pdfsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const AdminPDFs = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    description: '',
    display_order: 0,
    pdf: null
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchPDFs();
    
    if (params.id) {
      fetchPDF(params.id);
    }
  }, [params.id]);

  const fetchPDFs = async () => {
    try {
      const data = await pdfsAPI.getAdminAll();
      setPdfs(data);
    } catch (error) {
      showMessage('error', 'Failed to fetch PDFs');
    } finally {
      setLoading(false);
    }
  };

  const fetchPDF = async (id) => {
    try {
      const data = await pdfsAPI.getById(id);
      setFormData({
        title: data.title || '',
        title_en: data.title_en || '',
        description: data.description || '',
        display_order: data.display_order || 0,
        pdf: null
      });
      setEditingId(id);
      setShowUploadForm(true);
    } catch (error) {
      showMessage('error', 'Failed to fetch PDF details');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showMessage('error', 'Please select a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showMessage('error', 'File size must be less than 10MB');
        return;
      }
      setFormData(prev => ({ ...prev, pdf: file }));
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // For updates, only send metadata if no new PDF
        if (!formData.pdf) {
          await pdfsAPI.update(editingId, {
            title: formData.title,
            title_en: formData.title_en,
            description: formData.description,
            display_order: formData.display_order
          });
        } else {
          // If there's a new PDF, use FormData
          const formDataToSend = new FormData();
          formDataToSend.append('title', formData.title);
          formDataToSend.append('title_en', formData.title_en);
          formDataToSend.append('description', formData.description);
          formDataToSend.append('display_order', formData.display_order);
          formDataToSend.append('pdf', formData.pdf);
          
          await pdfsAPI.update(editingId, formDataToSend);
        }
        showMessage('success', 'PDF updated successfully');
      } else {
        // New upload
        if (!formData.pdf) {
          showMessage('error', 'Please select a PDF file');
          setLoading(false);
          return;
        }
        
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('title_en', formData.title_en);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('display_order', formData.display_order);
        formDataToSend.append('pdf', formData.pdf);
        
        await pdfsAPI.upload(formDataToSend);
        showMessage('success', 'PDF uploaded successfully');
      }
      
      resetForm();
      fetchPDFs();
    } catch (error) {
      showMessage('error', error.message || 'Failed to save PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this PDF? This action cannot be undone!')) return;

    try {
      await pdfsAPI.delete(id);
      showMessage('success', 'PDF deleted successfully');
      fetchPDFs();
    } catch (error) {
      showMessage('error', 'Failed to delete PDF');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_en: '',
      description: '',
      display_order: 0,
      pdf: null
    });
    setSelectedFile(null);
    setEditingId(null);
    setShowUploadForm(false);
    navigate('/admin/pdfs');
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileUrl = (path) => {
    return path ? `http://localhost:5000${path}` : '#';
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
        <h1 className="text-3xl font-bold text-[#fbb829]">PDF Documents Management</h1>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-[#fbb829] text-black px-4 py-2 rounded-lg hover:bg-white transition"
        >
          {showUploadForm ? 'View List' : '+ Upload PDF'}
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

      {/* Upload Form */}
      {showUploadForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 border border-[#fbb829] rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-[#fbb829] mb-4">
            {editingId ? 'Edit PDF Details' : 'Upload New PDF'}
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

            {/* Description */}
            <div>
              <label className="block text-white mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white"
                placeholder="Brief description of the document..."
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

            {/* PDF Upload */}
            {!editingId && (
              <div>
                <label className="block text-white mb-2">Select PDF File *</label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#fbb829] rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#fbb829] file:text-black hover:file:bg-white"
                  required={!editingId}
                />
                <p className="text-white/40 text-xs mt-1">Max file size: 10MB</p>
              </div>
            )}

            {/* Selected File Info */}
            {selectedFile && (
              <div className="bg-green-600/20 border border-green-600 rounded-lg p-3">
                <p className="text-green-500 text-sm">
                  ✓ Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              </div>
            )}

            {/* Form Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#fbb829] text-black px-6 py-2 rounded-lg hover:bg-white transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update PDF' : 'Upload PDF')}
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

      {/* PDFs List */}
      {!showUploadForm && (
        <div className="bg-black/40 border border-[#fbb829] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#fbb829]/20">
              <tr>
                <th className="px-6 py-3 text-left text-[#fbb829]">ID</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Title</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Description</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">File Size</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Status</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Uploaded</th>
                <th className="px-6 py-3 text-left text-[#fbb829]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fbb829]/20">
              {pdfs.map((pdf) => (
                <tr key={pdf.id} className="hover:bg-[#fbb829]/5">
                  <td className="px-6 py-4 text-white">{pdf.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">{pdf.title}</div>
                    <div className="text-white/60 text-sm">{pdf.title_en}</div>
                  </td>
                  <td className="px-6 py-4 text-white/80 max-w-xs truncate">
                    {pdf.description || '-'}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {formatFileSize(pdf.file_size)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      pdf.is_active 
                        ? 'bg-green-600/20 text-green-500' 
                        : 'bg-red-600/20 text-red-500'
                    }`}>
                      {pdf.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/60 text-sm">
                    {new Date(pdf.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <a
                        href={getFileUrl(pdf.file_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-400"
                        title="View PDF"
                      >
                        👁️
                      </a>
                      <a
                        href={getFileUrl(pdf.file_path)}
                        download
                        className="text-green-500 hover:text-green-400"
                        title="Download"
                      >
                        ⬇️
                      </a>
                      <button
                        onClick={() => navigate(`/admin/pdfs/edit/${pdf.id}`)}
                        className="text-blue-500 hover:text-blue-400"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(pdf.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pdfs.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-white/60">
                    No PDFs found. Click "Upload PDF" to add one.
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

export default AdminPDFs;