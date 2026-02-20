import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JagannathLogo from '../common/JagannathLogo';

const galleryImages = [
  {
    id: 1,
    url: "https://i.pinimg.com/736x/c6/ca/5f/c6ca5f58ca263889839eeec434f3cc10.jpg",
    title: "ଶ୍ରୀ ଜଗନ୍ନାଥ ଦର୍ଶନ"
  },
  {
    id: 2,
    url: "https://i.pinimg.com/736x/c6/ca/5f/c6ca5f58ca263889839eeec434f3cc10.jpg",
    title: "ପୁରୀ ମନ୍ଦିର"
  },
  {
    id: 3,
    url: "https://i.pinimg.com/736x/c6/ca/5f/c6ca5f58ca263889839eeec434f3cc10.jpg",
    title: "ରଥଯାତ୍ରା ଉତ୍ସବ"
  },
  {
    id: 4,
    url: "https://i.pinimg.com/736x/c6/ca/5f/c6ca5f58ca263889839eeec434f3cc10.jpg",
    title: "ଭକ୍ତମାନଙ୍କ ସେବା"
  },
  {
    id: 5,
    url: "https://i.pinimg.com/736x/c6/ca/5f/c6ca5f58ca263889839eeec434f3cc10.jpg",
    title: "ମହାପ୍ରସାଦ"
  },
  {
    id: 6,
    url: "https://i.pinimg.com/736x/c6/ca/5f/c6ca5f58ca263889839eeec434f3cc10.jpg",
    title: "ଭଜନ ଓ କୀର୍ତ୍ତନ"
  }
];

const GalleryGrid = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="relative min-h-screen pt-24 overflow-hidden">

      {/* 🔴 Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e31b23] to-black" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #fbb829 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container-custom relative z-10 text-white">

        {/* 🔥 Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center mb-6">
            <JagannathLogo size="lg" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-[#fbb829] mb-4">
            ଦିବ୍ୟ ଗ୍ୟାଲେରୀ
          </h1>

          <p className="text-white/80">
            ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ଦିବ୍ୟ ମୁହୂର୍ତ୍ତ ଓ ଭକ୍ତମାନଙ୍କ ଅନୁଭବ
          </p>
        </motion.div>

        {/* 🔥 Hero Slider */}
        <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,0,0,0.5)] mb-16">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
            <div className="absolute bottom-0 p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#fbb829]">
                {galleryImages[currentIndex].title}
              </h2>
            </div>

            {/* Play Button */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full"
            >
              {isAutoPlaying ? '⏸️' : '▶️'}
            </button>
          </div>
        </div>

        {/* 🔥 Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px]">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl group border border-red-600 ${
                index % 4 === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition">
                <div className="absolute bottom-0 p-4">
                  <h3 className="text-[#fbb829] font-semibold">
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
