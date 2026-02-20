import React from 'react';
import { motion } from 'framer-motion';

const events = [
  {
    id: 1,
    title: "ରଥଯାତ୍ରା ମହୋତ୍ସବ",
    date: "ଜୁନ 2026",
    time: "ପୂରା ଦିନ",
    description: "ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ପବିତ୍ର ରଥଯାତ୍ରା ଉତ୍ସବରେ ଯୋଗଦିଅନ୍ତୁ।",
    image: "https://i.pinimg.com/736x/85/05/ad/8505ad5184b8dbf5bec05ce758ed1046.jpg"
  },
  {
    id: 2,
    title: "ଦୈନିକ ଦର୍ଶନ",
    date: "ପ୍ରତିଦିନ",
    time: "ସକାଳ 6ଟା - ରାତି 9ଟା",
    description: "ପବିତ୍ର ଦର୍ଶନ ଓ ମହାପ୍ରସାଦ ସେବନ କରନ୍ତୁ।",
    image: "https://i.pinimg.com/736x/85/05/ad/8505ad5184b8dbf5bec05ce758ed1046.jpg"
  },
  {
    id: 3,
    title: "ଭଜନ ଓ କୀର୍ତ୍ତନ",
    date: "ପ୍ରତି ଶନିବାର",
    time: "ସନ୍ଧ୍ୟା 7ଟା",
    description: "ଜଗନ୍ନାଥ ଭଜନ ଓ କୀର୍ତ୍ତନରେ ଆତ୍ମିକ ଶାନ୍ତି ଅନୁଭବ କରନ୍ତୁ।",
    image: "https://i.pinimg.com/736x/85/05/ad/8505ad5184b8dbf5bec05ce758ed1046.jpg"
  }
];

const Events = () => {
  return (
    <section id="events" className="relative py-20 overflow-hidden">

      {/* 🔴 Background (Same as Banner) */}
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
            ପବିତ୍ର ଉତ୍ସବ ଓ ସେବା
          </h2>

          <p className="text-white/80 max-w-2xl mx-auto">
            ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ଦିବ୍ୟ କାର୍ଯ୍ୟକ୍ରମରେ ଯୋଗଦିଅନ୍ତୁ
          </p>

          <div className="w-24 h-1 bg-[#fbb829] mx-auto mt-4" />
        </motion.div>

        {/* 🔥 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/60 border border-red-600 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(255,0,0,0.4)] hover:shadow-[0_0_25px_rgba(255,0,0,0.7)] transition-all duration-300"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6 text-white">
                <h3 className="text-xl font-semibold text-[#fbb829] mb-2">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-white/80">
                  <p>📅 {event.date}</p>
                  <p>⏰ {event.time}</p>
                </div>

                <p className="text-sm mb-4 text-white/80">
                  {event.description}
                </p>

                <button className="w-full px-4 py-2 bg-[#fbb829] text-black rounded-lg font-semibold hover:bg-white transition-all">
                  🙏 ଅଧିକ ଜାଣନ୍ତୁ
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Events;
