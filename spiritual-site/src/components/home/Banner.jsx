import React from 'react';
import { motion } from 'framer-motion';

const Banner = () => {
  return (
    <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.pinimg.com/1200x/13/f3/df/13f3df060323b570725eb40124aaa09b.jpg" 
          alt="Spiritual Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center text-white px-4"
      >
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
          Find Your Inner Peace
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Welcome to a space of tranquility, meditation, and spiritual growth
        </p>
        <a 
          href="#about" 
          className="inline-block px-8 py-3 bg-white/20 backdrop-blur-sm border-2 border-white rounded-full text-lg hover:bg-white/30 transition-all duration-300"
        >
          Begin Your Journey
        </a>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Banner;