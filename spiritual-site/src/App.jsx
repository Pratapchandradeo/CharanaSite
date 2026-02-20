import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import WelcomeDialog from './components/common/WelcomeDialog';
import Members from './pages/Members';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <WelcomeDialog />
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/members" element={<Members />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;