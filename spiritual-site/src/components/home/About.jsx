import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-spiritual-800 mb-4">
            About Our Sanctuary
          </h2>
          <div className="w-24 h-1 bg-spiritual-300 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img 
              src="https://images.unsplash.com/photo-1545389336-cf0902504353?auto=format&fit=crop&w=800" 
              alt="Meditation Space"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-spiritual-700 leading-relaxed">
              Welcome to SpiritualSpace, a haven for those seeking peace, mindfulness, 
              and spiritual connection. Founded in 2010, we've been guiding souls on 
              their journey to inner harmony.
            </p>
            <p className="text-lg text-spiritual-700 leading-relaxed">
              Our sanctuary offers a unique blend of traditional wisdom and modern 
              practices, creating an environment where everyone can find their path 
              to spiritual growth.
            </p>
            
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-spiritual-600">15+</div>
                <div className="text-sm text-spiritual-500">Years of Service</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-spiritual-600">50+</div>
                <div className="text-sm text-spiritual-500">Monthly Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-spiritual-600">1000+</div>
                <div className="text-sm text-spiritual-500">Community Members</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;