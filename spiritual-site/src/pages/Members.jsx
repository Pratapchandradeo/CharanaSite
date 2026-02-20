import React from 'react';
import { motion } from 'framer-motion';
import JagannathLogo from '../components/common/JagannathLogo';

const pdfList = [
  {
    id: 1,
    title: "ଭକ୍ତମାନଙ୍କ ତାଲିକା",
    file: "/pdfs/members-list.pdf"
  },
  {
    id: 2,
    title: "ସେବା ତାଲିକା",
    file: "/pdfs/seva-list.pdf"
  },
  {
    id: 3,
    title: "ରଥଯାତ୍ରା ସଦସ୍ୟ",
    file: "/pdfs/rath-yatra-members.pdf"
  }
];

const Members = () => {
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
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <JagannathLogo size="lg" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-[#fbb829] mb-4">
            ସଦସ୍ୟ ତାଲିକା
          </h1>

          <p className="text-white/80">
            ଭକ୍ତମାନଙ୍କ ତଥ୍ୟ ଓ ସେବା ସୂଚନା
          </p>
        </motion.div>

        {/* 🔥 PDF Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pdfList.map((pdf, index) => (
            <motion.div
              key={pdf.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/60 border border-red-600 rounded-xl p-6 shadow-[0_0_15px_rgba(255,0,0,0.4)] hover:shadow-[0_0_25px_rgba(255,0,0,0.7)] transition"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 text-center">📄</div>

              {/* Title */}
              <h3 className="text-xl text-[#fbb829] font-semibold text-center mb-4">
                {pdf.title}
              </h3>

              {/* Buttons */}
              <div className="flex gap-3">
                <a
                  href={pdf.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-[#fbb829] text-black py-2 rounded-lg font-semibold hover:bg-white transition"
                >
                  👁️ View
                </a>

                <a
                  href={pdf.file}
                  download
                  className="flex-1 text-center border border-[#fbb829] py-2 rounded-lg hover:bg-[#fbb829] hover:text-black transition"
                >
                  ⬇️ Download
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Members;
