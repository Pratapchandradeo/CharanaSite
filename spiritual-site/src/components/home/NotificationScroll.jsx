import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Temporary static notifications (will be replaced with API data)
const notifications = [
  { id: 1, message: "🌅 Morning Meditation - Today at 6:00 AM", type: "event" },
  { id: 2, message: "📿 New spiritual gallery images uploaded!", type: "update" },
  { id: 3, message: "🧘 Weekend Retreat - This Saturday", type: "event" },
  { id: 4, message: "✨ Full Moon Ceremony - March 25th", type: "special" },
  { id: 5, message: "🌸 Spring Equinox Celebration - Join us!", type: "event" },
];

const NotificationScroll = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTypeColor = (type) => {
    switch(type) {
      case 'event': return 'bg-blue-500';
      case 'update': return 'bg-green-500';
      case 'special': return 'bg-purple-500';
      default: return 'bg-spiritual-500';
    }
  };

  return (
    <div className="bg-spiritual-100 py-4 border-y border-spiritual-200">
      <div className="container-custom">
        <div className="flex items-center space-x-4">
          {/* Label */}
          <div className="flex-shrink-0">
            <span className="bg-spiritual-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              📢 Announcements
            </span>
          </div>

          {/* Scrolling Messages */}
          <div className="flex-grow overflow-hidden relative h-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full"
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-2 h-2 rounded-full ${getTypeColor(notifications[currentIndex].type)}`} />
                  <span className="text-spiritual-800 text-lg">
                    {notifications[currentIndex].message}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Counter */}
          <div className="flex-shrink-0 text-sm text-spiritual-500">
            {currentIndex + 1} / {notifications.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationScroll;