import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import WelcomeDialog from './components/common/WelcomeDialog';

// Public Pages
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import Members from './pages/Members';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNotifications from './pages/Admin/AdminNotifications';
import AdminEvents from './pages/Admin/AdminEvents';
import AdminGallery from './pages/Admin/AdminGallery';
import AdminPDFs from './pages/Admin/AdminPDFs';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <WelcomeDialog />
          
          {/* Public Routes with Navbar/Footer */}
          <Routes>
            {/* Admin Routes (No Navbar/Footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="notifications/new" element={<AdminNotifications />} />
              <Route path="notifications/edit/:id" element={<AdminNotifications />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="events/new" element={<AdminEvents />} />
              <Route path="events/edit/:id" element={<AdminEvents />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="gallery/upload" element={<AdminGallery />} />
              <Route path="pdfs" element={<AdminPDFs />} />
              <Route path="pdfs/upload" element={<AdminPDFs />} />
            </Route>

            {/* Public Routes with Navbar/Footer */}
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <div className="flex-grow">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/gallery" element={<GalleryPage />} />
                      <Route path="/members" element={<Members />} />
                    </Routes>
                  </div>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;