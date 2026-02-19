import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const galleryImages = [
  {
    id: 1,
    url: "https://i.pinimg.com/1200x/13/f3/df/13f3df060323b570725eb40124aaa09b.jpg",
    title: "Lord Jagannath, Balabhadra & Subhadra"
  },
  {
    id: 2,
    url: "https://i.pinimg.com/1200x/13/f3/df/13f3df060323b570725eb40124aaa09b.jpg",
    title: "Jagannath Temple, Puri"
  },
  {
    id: 3,
    url: "https://i.pinimg.com/1200x/13/f3/df/13f3df060323b570725eb40124aaa09b.jpg",
    title: "Rath Yatra Festival"
  },
  {
    id: 4,
    url: "https://i.pinimg.com/1200x/13/f3/df/13f3df060323b570725eb40124aaa09b.jpg",
    title: "Lord Jagannath Idol"
  },
  {
    id: 5,
    url: "https://i.pinimg.com/1200x/13/f3/df/13f3df060323b570725eb40124aaa09b.jpg",
    title: "Puri Spiritual Sunrise"
  },
  {
    id: 6,
    url: "https://i.pinimg.com/1200x/13/f3/df/13f3df060323b570725eb40124aaa09b.jpg",
    title: "Temple Flag Ritual"
  }
];

const GalleryGrid = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto hero change
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="min-h-screen bg-spiritual-50 pt-24">
      <div className="container-custom">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-spiritual-800 mb-4">
            Jagannath Divine Gallery
          </h1>

          <p className="text-lg text-spiritual-600 mb-8">
            Experience the divine presence of Lord Jagannath and Odisha's sacred heritage
          </p>

          {/* Auto Image */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={galleryImages[currentIndex].url}
                alt={galleryImages[currentIndex].title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-0 p-8 text-white">
                <h2 className="text-3xl font-display font-bold">
                  {galleryImages[currentIndex].title}
                </h2>
              </div>

              {/* Play / Pause */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full"
              >
                {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Unique Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl group ${
                index % 4 === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition">
                <div className="absolute bottom-0 p-4 text-white">
                  <h3 className="text-lg font-semibold">
                    {image.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default GalleryGrid;
