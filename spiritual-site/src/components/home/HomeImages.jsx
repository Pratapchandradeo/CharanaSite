import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  {
    id: 1,
    url: "https://i.pinimg.com/736x/85/05/ad/8505ad5184b8dbf5bec05ce758ed1046.jpg",
    title: "ରଥଯାତ୍ରା ଭକ୍ତି ମହୋତ୍ସବ",
    description: "ଭକ୍ତମାନଙ୍କ ଦ୍ୱାରା ରଥ ଟାଣାଯାଉଛି"
  },
  {
    id: 2,
    url: "https://i.pinimg.com/736x/85/05/ad/8505ad5184b8dbf5bec05ce758ed1046.jpg",
    title: "ମହାପ୍ରସାଦ ସେବା",
    description: "ପବିତ୍ର ମହାପ୍ରସାଦ ବଣ୍ଟନ"
  },
  {
    id: 3,
    url: "https://i.pinimg.com/736x/85/05/ad/8505ad5184b8dbf5bec05ce758ed1046.jpg",
    title: "ଭଜନ ଓ କୀର୍ତ୍ତନ",
    description: "ଭକ୍ତମାନଙ୍କ ଭଜନ ଗାୟନ"
  }
];

const HomeImages = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">

      {/* 🔴 Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e31b23] to-[#000000]" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #fbb829 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container-custom relative z-10">

        {/* 🔥 Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12 text-white"
        >

          <h2 className="text-4xl md:text-5xl font-bold text-[#fbb829] mb-4">
            ଭକ୍ତିର ମୁହୂର୍ତ୍ତ
          </h2>

          <p className="text-white/80 max-w-2xl mx-auto">
            ଭକ୍ତମାନଙ୍କ ଦ୍ୱାରା ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ସେବା ଓ ଉତ୍ସବର ଦୃଶ୍ୟ
          </p>

          <div className="w-24 h-1 bg-[#fbb829] mx-auto mt-4" />
        </motion.div>

        {/* 🔥 Main Slider */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,0,0,0.5)]">

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img 
                src={images[currentIndex].url}
                alt={images[currentIndex].title}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold text-[#fbb829] mb-2">
                  {images[currentIndex].title}
                </h3>
                <p className="text-white/90">
                  {images[currentIndex].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#fbb829] w-6' 
                    : 'bg-white/50 w-3'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 🔥 Small Grid (Extra Images Preview) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden rounded-lg border border-red-600"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-32 object-cover"
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HomeImages;
