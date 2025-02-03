import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import Hero from "./Hero";
import CoachList from "./CoachList";
import EventCalendar from "./EventCalendar";

const MainLayout = () => {
  useEffect(() => {
    // Render Hero component inside "hero-section"
    const heroEl = document.getElementById("hero-section");
    if (heroEl) ReactDOM.createRoot(heroEl).render(<Hero />);

    // Render CoachList component inside "coaches-section"
    const coachesEl = document.getElementById("coaches-section");
    if (coachesEl) ReactDOM.createRoot(coachesEl).render(<CoachList />);

    // Render EventCalendar component inside "events-section"
    const eventsEl = document.getElementById("events-section");
    if (eventsEl) ReactDOM.createRoot(eventsEl).render(<EventCalendar />);
  }, []);

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section id="hero-section" className="relative w-full h-64 overflow-hidden"></section>

      {/* Coaches Section */}
      <section id="coaches-section" className="py-10 bg-white px-10">
        <h2 className="text-3xl font-bold text-center mb-6">Our Coaches</h2>
      </section>

      {/* Events Section */}
      <section id="events-section" className="py-10 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6">Upcoming Events</h2>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-gray-800 text-white text-center">
        <p>&copy; 2024 Sports Faculty Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
