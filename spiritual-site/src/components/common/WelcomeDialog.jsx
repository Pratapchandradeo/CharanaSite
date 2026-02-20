import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomeDialog = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // 3 sec

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
          {/* Center Content */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Jagannath Image */}
            <img
              src="/images/jagannath/welcomeImage-removebg-preview.png"
              alt="Jagannath"
              className="w-40 md:w-56 mb-6"
            />

            {/* Odia Text */}
            <h1
              className="text-4xl md:text-6xl font-bold text-white tracking-wide"
              style={{ fontFamily: "'Baloo Bhai 2', cursive" }}
            >
              ଜୟ ଜଗନ୍ନାଥ
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeDialog;
