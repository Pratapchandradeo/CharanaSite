import React from 'react';
import { motion } from 'framer-motion';
import JagannathLogo from '../common/JagannathLogo';

const About = () => {
  return (
    <section id="about" className="relative py-20 overflow-hidden">

      {/* 🔴 Background (Same as Banner Theme) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e31b23] to-[#000000]" />

        {/* Pattern */}
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
          transition={{ duration: 0.6 }}
          className="text-center mb-12 text-white"
        >
          <div className="flex justify-center mb-6">
            <JagannathLogo size="lg" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#fbb829] mb-4">
            ଭକ୍ତି ପରିବାର
          </h2>

          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ଭକ୍ତମାନଙ୍କର ଏକତାର ସ୍ଥାନ
          </p>

          <div className="w-24 h-1 bg-[#fbb829] mx-auto mt-4" />
        </motion.div>

        {/* 🔥 Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-white">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-lg leading-relaxed">
              ଏହି ପ୍ଲାଟଫର୍ମ ହେଉଛି ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ଭକ୍ତମାନଙ୍କ ପାଇଁ ଏକ ଦିବ୍ୟ ସ୍ଥାନ, 
              ଯେଉଁଠାରେ ଭକ୍ତି, ଶ୍ରଦ୍ଧା ଓ ଆତ୍ମିକ ଶାନ୍ତିର ଅନୁଭବ ମିଳେ।
            </p>

            <p className="text-lg leading-relaxed">
              ଏଠାରେ ଆପଣ ଦର୍ଶନ, ଭଜନ, ରଥଯାତ୍ରା ସୂଚନା ଓ ଅନ୍ୟାନ୍ୟ ଧାର୍ମିକ 
              କାର୍ଯ୍ୟକ୍ରମ ସମ୍ପର୍କରେ ଜାଣିପାରିବେ।
            </p>
          </motion.div>

          {/* Right Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-6"
          >
            {/* Devotees */}
            <div className="bg-black/40 border border-red-600 rounded-xl p-6 text-center shadow-[0_0_15px_rgba(255,0,0,0.4)]">
              <div className="text-3xl font-bold text-[#fbb829]">10K+</div>
              <div className="text-sm mt-2">ଭକ୍ତମାନେ ଯୋଗ ଦେଇଛନ୍ତି</div>
            </div>

            {/* Daily Visitors */}
            <div className="bg-black/40 border border-red-600 rounded-xl p-6 text-center shadow-[0_0_15px_rgba(255,0,0,0.4)]">
              <div className="text-3xl font-bold text-[#fbb829]">2K+</div>
              <div className="text-sm mt-2">ଦୈନିକ ଦର୍ଶନ</div>
            </div>

            {/* Bhajans */}
            <div className="bg-black/40 border border-red-600 rounded-xl p-6 text-center shadow-[0_0_15px_rgba(255,0,0,0.4)]">
              <div className="text-3xl font-bold text-[#fbb829]">500+</div>
              <div className="text-sm mt-2">ଭଜନ ଓ ପୂଜା</div>
            </div>

            {/* Events */}
            <div className="bg-black/40 border border-red-600 rounded-xl p-6 text-center shadow-[0_0_15px_rgba(255,0,0,0.4)]">
              <div className="text-3xl font-bold text-[#fbb829]">50+</div>
              <div className="text-sm mt-2">ଉତ୍ସବ ଓ କାର୍ଯ୍ୟକ୍ରମ</div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
