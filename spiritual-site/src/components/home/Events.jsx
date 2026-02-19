import React from 'react';
import { motion } from 'framer-motion';

const events = [
  {
    id: 1,
    title: "Morning Meditation",
    date: "Every Monday & Wednesday",
    time: "6:00 AM - 7:00 AM",
    description: "Start your day with guided meditation and pranayama.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400"
  },
  {
    id: 2,
    title: "Weekend Retreat",
    date: "March 25-27, 2024",
    time: "Full Weekend",
    description: "Deepen your practice with intensive meditation sessions.",
    image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=400"
  },
  {
    id: 3,
    title: "Full Moon Ceremony",
    date: "March 25, 2024",
    time: "7:00 PM - 9:00 PM",
    description: "Special evening of chanting and meditation under the full moon.",
    image: "https://images.unsplash.com/photo-1516617442634-75371039cb9a?auto=format&fit=crop&w=400"
  }
];

const Events = () => {
  return (
    <section id="events" className="py-20 bg-spiritual-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-spiritual-800 mb-4">
            Upcoming Events
          </h2>
          <div className="w-24 h-1 bg-spiritual-300 mx-auto" />
          <p className="text-spiritual-600 mt-4 max-w-2xl mx-auto">
            Join us in our journey of spiritual growth and community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display font-semibold text-spiritual-700 mb-2">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <p className="flex items-center text-spiritual-500 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date}
                  </p>
                  <p className="flex items-center text-spiritual-500 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {event.time}
                  </p>
                </div>
                <p className="text-spiritual-600 text-sm mb-4">
                  {event.description}
                </p>
                <button className="w-full px-4 py-2 bg-spiritual-600 text-white rounded-lg hover:bg-spiritual-700 transition-colors">
                  Learn More
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