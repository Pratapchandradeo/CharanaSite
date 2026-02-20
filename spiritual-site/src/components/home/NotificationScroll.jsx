import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const notifications = [
  { id: 1, message: "🙏 ମଙ୍ଗଳ ଆରତି ପ୍ରତିଦିନ ସକାଳ ୬ଟାରେ", type: "seva" },
  { id: 2, message: "🛕 ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ଦର୍ଶନ ସମୟ ଅଦ୍ୟତନ", type: "update" },
  { id: 3, message: "📿 ଭକ୍ତମାନଙ୍କ ପାଇଁ ନୂତନ ଭଜନ ଯୋଡାଯାଇଛି", type: "bhajan" },
  { id: 4, message: "✨ ଆସନ୍ତା ପୂର୍ଣ୍ଣିମାରେ ବିଶେଷ ପୂଜା", type: "special" },
  { id: 5, message: "🚩 ରଥଯାତ୍ରା ପାଇଁ ପ୍ରସ୍ତୁତି ଆରମ୍ଭ", type: "festival" },
];

const NotificationScroll = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Jagannath theme colors
  const getTypeColor = (type) => {
    switch(type) {
      case 'seva': return 'bg-yellow-400';
      case 'update': return 'bg-red-500';
      case 'bhajan': return 'bg-white';
      case 'special': return 'bg-yellow-500';
      case 'festival': return 'bg-red-600';
      default: return 'bg-red-500';
    }
  };

  return (
    <div className="bg-black border-y border-red-600 py-3">
      <div className="container-custom">
        <div className="flex items-center space-x-4">

          {/* Label */}
          <div className="flex-shrink-0">
            <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-[0_0_10px_rgba(255,0,0,0.6)]">
              🛕 ମନ୍ଦିର ସୂଚନା
            </span>
          </div>

          {/* Scrolling Message */}
          <div className="flex-grow overflow-hidden relative h-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute w-full"
              >
                <div className="flex items-center space-x-3">

                  {/* Dot */}
                  <span className={`w-2 h-2 rounded-full ${getTypeColor(notifications[currentIndex].type)} shadow`} />

                  {/* Text */}
                  <span className="text-white text-base md:text-lg tracking-wide">
                    {notifications[currentIndex].message}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Counter */}
          <div className="flex-shrink-0 text-xs text-yellow-400">
            {currentIndex + 1} / {notifications.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationScroll;
