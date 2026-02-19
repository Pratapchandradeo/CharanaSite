import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Temporary static images (will be replaced with API data)
const images = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200",
    title: "Peaceful Meditation",
    description: "Find stillness within"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200",
    title: "Sacred Space",
    description: "A place for reflection"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1507120878965-54b2d3939100?auto=format&fit=crop&w=1200",
    title: "Nature's Temple",
    description: "Connect with the divine"
  }
];

const HomeImages = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-spiritual-800 mb-4">
            Spiritual Moments
          </h2>
          <div className="w-24 h-1 bg-spiritual-300 mx-auto" />
        </motion.div>

        <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img 
                src={images[currentIndex].url}
                alt={images[currentIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Caption */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-0 left-0 right-0 p-12 text-white"
              >
                <h3 className="text-3xl font-display font-bold mb-2">
                  {images[currentIndex].title}
                </h3>
                <p className="text-lg text-white/90">
                  {images[currentIndex].description}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Image Indicators */}
          <div className="absolute bottom-6 right-6 z-10 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeImages;