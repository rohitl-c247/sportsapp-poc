import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import calendarFrame from "./images/calender.png"

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [filterevents, setFilterEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", eventDate: "" });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_BASEURL;
  const [value, onChange] = useState(new Date());
  // Fetch events from the API
  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [value]);

  const filterEvents = async () => {
    if (!value) return;

    // Convert selected date to 'YYYY-MM-DD' format
    const formatDate = (date) => {
      return new Date(date).toISOString().split("T")[0]; // Extracts only YYYY-MM-DD
    };

    // Filter events based on the formatted date
    const filteredEvents = events.filter(
      (event) => formatDate(event.eventDate) === formatDate(value)
    );

    setFilterEvents(filteredEvents);
  };


  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${baseURL}/events`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      }); // Replace with your API endpoint
      setEvents(response.data.data.events);
      setFilterEvents(response.data.data.events);

    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  const deleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(`${baseURL}/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      }); // Replace with your API endpoint
      alert("Event Deleted Successfully.");
      await fetchEvents();
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
    setError(""); // Clear any previous errors
    setNewEvent({ title: "", date: "" }); // Reset the form
  };

  // Handle input changes in the modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  // Handle form submission to add a new event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.eventDate) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/events`, newEvent, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      }); // Replace with your API endpoint

      toggleModal(); // Close the modal
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
      setError("Failed to add event. Please try again.");
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-6 p-6 max-w-7xl mx-auto">
        <div className="">
          <h6 className="center text-4xl mb-10 pb-4 font-lobster">All the events</h6>
          <div>
            {filterevents.length > 0 ? filterevents.map((event, index) => (
              <div
                key={index}
                className="p-4 flex items-center mb-6 shadow-lg border-2 border-gray-200 rounded-lg position-relative"
              >
                <div className="w-full flex">
                  <div className="flex flex-col bg-gray-100 p-4 justify-center">
                    <span className="text-2xl font-semibold pb-3">
                      {new Date(event.eventDate).toLocaleDateString('en-US', { day: 'numeric' })}
                    </span>
                    <span>
                      {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', })}
                    </span>
                  </div>
                  <div className="pl-5">
                    <h3 className="text-2xl font-semibold pb-3">{event.title}</h3>
                    <p className="text-gray-600">Date: {event.eventDate}</p>
                  </div>
                </div>
                {token && token != null && (
                  <button
                    type="button"
                    onClick={() => deleteEvent(event._id)}
                    className="text-red-600 hover:text-red-800 p-2 "
                    title="Delete event"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )) : <div className="text-center text-gray-500">No events for this date</div>}

            {token && token != null && (
              <div key={`btn`}>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Add New Event
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="">
          <div className="calendar-wrapper">
            <img src={calendarFrame} className="calendar-frame position-relative" />
            <div className="calendar-container">
              <Calendar onClickDay={(value, event) => (console.log(value))} onChange={onChange} value={value} />
            </div>
          </div>

        </div>
      </div>

      {/* Modal for Adding a New Event */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleAddEvent}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter event title"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={newEvent.eventDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCalendar;
