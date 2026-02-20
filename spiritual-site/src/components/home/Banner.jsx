import React from "react";
import { motion } from "framer-motion";

const Banner = () => {
  return (
    <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background with Jagannath red and black */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e31b23] to-[#1a1a1a]" />

        {/* Traditional Pattachitra pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #fbb829 2px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Jagannath Wheel pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%23fbb829' fill='none' stroke-width='2'/%3E%3Ccircle cx='50' cy='50' r='30' stroke='%23fbb829' fill='none' stroke-width='2'/%3E%3Cpath d='M50 10L50 90M10 50L90 50M50 50L70 30M50 50L70 70M50 50L30 30M50 50L30 70' stroke='%23fbb829' stroke-width='2'/%3E%3C/svg%3E")`,
            backgroundSize: "150px 150px",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center text-white px-4 max-w-4xl"
      >
        {/* Jagannath Eyes (symbolic) */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="flex flex-col items-center mb-10"
        >
          {/* Eyes + Tilak */}
          <div className="flex items-center justify-center space-x-10">
            {/* Left Eye */}
            <div className="w-24 h-24 bg-white rounded-full border-[6px] border-red-600 flex items-center justify-center">
              <div className="w-10 h-10 bg-black rounded-full" />
            </div>

            {/* Tilak */}
            <div className="flex flex-col items-center -mt-6">
              {/* White outer */}
              <div className="w-6 h-16 border-2 border-white rounded-b-full flex items-start justify-center">
                {/* Red inner */}
                <div className="w-2 h-10 bg-red-600 rounded-full mt-1" />
              </div>
              {/* Bottom drop */}
              <div className="w-2 h-3 bg-white rounded-b-full -mt-1" />
            </div>

            {/* Right Eye */}
            <div className="w-24 h-24 bg-white rounded-full border-[6px] border-red-600 flex items-center justify-center">
              <div className="w-10 h-10 bg-black rounded-full" />
            </div>
          </div>

          {/* Smile */}
          <div className="mt-6">
            <div className="w-40 h-16 border-b-[5px] border-red-600 rounded-b-full" />
          </div>
        </motion.div>

        <h1
          className="text-6xl md:text-8xl font-bold mb-4 text-[#fbb829]"
          style={{ fontFamily: "'Baloo Bhai 2', cursive" }}
        >
          ଜୟ ଜଗନ୍ନାଥ
        </h1>

        <p className="text-2xl md:text-3xl mb-4 text-white">
          ପତିତ ପାବନ ଶ୍ରୀ ଜଗନ୍ନାଥ
        </p>

        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90">
          ଭକ୍ତି, ଶ୍ରଦ୍ଧା ଓ ଆତ୍ମିକ ଶାନ୍ତିର ଦିବ୍ୟ ଅନୁଭବ ଜଗନ୍ନାଥଙ୍କ ଚରଣରେ ନମନ
        </p>

        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#darshan"
            className="px-8 py-3 bg-[#fbb829] text-[#1a1a1a] rounded-full text-lg font-semibold hover:bg-white transition-all duration-300"
          >
            🙏 ଦର୍ଶନ କରନ୍ତୁ
          </a>

          <a
            href="#bhajan"
            className="px-8 py-3 border-2 border-[#fbb829] text-white rounded-full text-lg hover:bg-[#fbb829] hover:text-[#1a1a1a] transition-all duration-300"
          >
            🎵 ଭଜନ ଶୁଣନ୍ତୁ
          </a>
        </div> */}
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-[#fbb829] rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#fbb829] rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Banner;
