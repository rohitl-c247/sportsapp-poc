import React, { useState, useEffect } from "react";
import axios from "axios";

const CoachList = () => {
  const [coaches, setCoaches] = useState([]);
  const [showModal, setShowModal] = useState(false); // For toggling modal visibility
  const [newCoach, setNewCoach] = useState({
    name: "",
    picture: "",
    email: "",
    dateOfBirth: "",
    description: "",
  });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_BASEURL;

  // Fetch coaches from the API
  const fetchCoaches = async () => {
    try {
      const response = await axios.get(`${baseURL}/user`);

      setCoaches(response.data.data.users); // Assuming the response contains a 'coaches' array
    } catch (error) {
      setError("Error fetching coaches");
      console.error("Error fetching coaches:", error);
    }
  };
  const deleteCoach = async (coachId) => {
    try {
      const response = await axios.delete(`${baseURL}/user/${coachId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      console.log("Coach deleted successfully.");
      await fetchCoaches();
    } catch (error) {
      setError("Error delete coach");
      console.error("Error fetching coaches:", error);
    }
  };
  // Add new coach through API
  const addNewCoach = async () => {
    try {
      const response = await axios.post(`${baseURL}/user`, newCoach, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setCoaches((prevCoaches) => [...prevCoaches, newCoach]); // Add the new coach to the list
      setShowModal(false); // Close the modal after adding
      await fetchCoaches();
    } catch (error) {
      setError("Error adding new coach");
      console.error("Error adding new coach:", error);
    }
  };

  // Handle input changes in the modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCoach((prev) => ({ ...prev, [name]: value }));
  };

  // Handle modal visibility toggle
  const toggleModal = () => setShowModal(!showModal);

  // Load coaches when the component mounts
  useEffect(() => {
    fetchCoaches();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h6 className="center text-2xl font-bold mb-4">All the Coaches</h6>
      {coaches.map((coach, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-gray-200 p-6 rounded-lg shadow-md relative"
        >
          <div className="flex items-center flex-grow">
            {/* Image on the Left */}
            <img
              src={coach.picture}
              className="w-24 h-24 square rounded-lg object-cover mr-6"
              alt={coach.name}
            />
            {/* Details on the Right */}
            <div className="ml-6">
              <h3 className="text-xl font-semibold">{coach.name}</h3>
              <p className="text-gray-600">{coach.description}</p>
            </div>
          </div>

          {token && token != null && (
            <button
              type="button"
              onClick={() => deleteCoach(coach.id)}
              className="right-2.5 absolute top-4 right-4 text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors"
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
      ))}

      {/* Add New Coach Button */}
      {token && token != null && (
        <button
          type="button"
          onClick={toggleModal}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Add New Coach
        </button>
      )}
      {/* Modal for Adding a New Coach */}
      {showModal && (
        <div
          className="fixed z-10 inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-30"
          style={{ marginTop: 0 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Coach</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newCoach.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter coach's name"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newCoach.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter coach's email"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dateOfBirth" className="block text-gray-700">
                  DOB
                </label>
                <input
                  type="text"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={newCoach.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter coach's dob"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dateOfBirth" className="block text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={newCoach.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter description"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="picture" className="block text-gray-700">
                  Image URL
                </label>
                <input
                  type="text"
                  id="picture"
                  name="picture"
                  value={newCoach.picture}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter image URL"
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
                  type="button"
                  onClick={addNewCoach}
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg"
                >
                  Add Coach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachList;
