import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import Hero from "./Hero";
import CoachList from "./CoachList";
import EventCalendar from "./EventCalendar";
import axios from "axios";
const baseURL = process.env.REACT_APP_BASEURL;

const PreviewPage = () => {
  const [content, setContent] = useState("");
  const [isContentLoaded, setIsContentLoaded] = useState(false);


  const loadDesign = async () => {
      try {
        const response = await axios.get(`${baseURL}/template`);
        localStorage.setItem("savedHTML", response.data.data.templates[0].htmlContent);
        localStorage.setItem("savedCSS", response.data.data.templates[0].cssContent);
        const savedHTML = localStorage.getItem("savedHTML") || "";
        const savedCSS = localStorage.getItem("savedCSS") || "";
        const fullContent = `
          <style>${savedCSS}</style>
          <div>${savedHTML}</div>
        `;
        setContent(fullContent);
      } catch (error) {
        console.error("Error updating template:", error);
      }
    }
  useEffect(() => {
    loadDesign();
  }, []);

  // Wait for content to be injected into the DOM before rendering components
  useEffect(() => {
    if (content) {
      // Wait until the content is rendered before triggering the component renders
      setIsContentLoaded(true);
    }
  }, [content]);

  useEffect(() => {
    if (isContentLoaded) {
      // Render Hero component inside "hero-section"
      const heroEls = document.querySelectorAll("[id^='hero-section']");
      heroEls.forEach(heroEl => {
        ReactDOM.createRoot(heroEl).render(<Hero />);
      });

      // Render CoachList component inside any "coaches-section-*" element
      const coachesEls = document.querySelectorAll("[id^='coaches-section-']");
      coachesEls.forEach(coachesEl => {
        ReactDOM.createRoot(coachesEl).render(<CoachList />);
      });

      // Render EventCalendar component inside any "events-section-*" element
      const eventsEls = document.querySelectorAll("[id^='events-section-']");
      eventsEls.forEach(eventsEl => {
        ReactDOM.createRoot(eventsEl).render(<EventCalendar />);
      });

    }
  }, [isContentLoaded]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      style={{ width: "100%", minHeight: "100vh" }}
    />
  );
};

export default PreviewPage;
