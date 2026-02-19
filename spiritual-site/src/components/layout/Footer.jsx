import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-spiritual-800 text-spiritual-100 py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-display font-semibold mb-4">About Us</h3>
            <p className="text-spiritual-200 text-sm leading-relaxed">
              A spiritual sanctuary dedicated to peace, meditation, and inner growth. 
              Join us on a journey of self-discovery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-display font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="text-spiritual-200 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-spiritual-200 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#events" className="text-spiritual-200 hover:text-white transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-spiritual-200 hover:text-white transition-colors">
                  Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xl font-display font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-spiritual-200">
              <p className="flex items-start space-x-3">
                <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Peace Street, Meditation Valley, CA 90210</span>
              </p>
              <p className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>peace@spiritualspace.com</span>
              </p>
              <p className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+1 (555) 123-4567</span>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-spiritual-700 mt-8 pt-8 text-center text-sm text-spiritual-300">
          <p>© {currentYear} SpiritualSpace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;