import React, { useEffect, useState } from "react";
import { eventsAPI } from "../../services/api"; // adjust path if needed

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventsAPI.getAll(); // your backend API
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="events" className="relative py-16 md:py-20 overflow-hidden">

      {/* 🔴 Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e31b23] to-black" />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #fbb829 2px, transparent 2px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container-custom relative z-10 px-4">

        {/* 🔥 Heading */}
        <div className="text-center mb-10 md:mb-12 text-white">
          <h2 className="text-2xl md:text-4xl font-bold text-[#fbb829] mb-3">
            ପବିତ୍ର ଉତ୍ସବ ଓ ସେବା
          </h2>

          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ଦିବ୍ୟ କାର୍ଯ୍ୟକ୍ରମରେ ଯୋଗଦିଅନ୍ତୁ
          </p>

          <div className="w-20 md:w-24 h-1 bg-[#fbb829] mx-auto mt-3" />
        </div>

        {/* 🔄 Loading */}
        {loading ? (
          <div className="text-center text-[#fbb829]">Loading...</div>
        ) : events.length === 0 ? (
          <div className="text-center text-white/60">No events available</div>
        ) : (
          /* 🔥 Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-black/60 border border-red-600 rounded-xl overflow-hidden shadow-md hover:shadow-red-600/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="h-44 md:h-48 overflow-hidden">
                  <img
                    src={`http://localhost:5000${event.image_path}`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 text-white">
                  <h3 className="text-lg md:text-xl font-semibold text-[#fbb829] mb-2">
                    {event.title}
                  </h3>

                  <div className="space-y-1 text-sm text-white/80 mb-3">
                    <p>📅 {event.date}</p>
                    <p>⏰ {event.time}</p>
                    {event.contact && (
                      <p className="text-[#fbb829] font-medium">
                        📞 {event.contact}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-white/80 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
