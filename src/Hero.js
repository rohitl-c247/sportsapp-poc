import React, { useState, useEffect } from "react";
import axios from "axios";

const Hero = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_BASEURL;

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/local-files`);

      // let imagesArr = response.data.data.files.map(image => image.path[0].replace(/^public\//, ''));
      setImages(response.data.data.files);
    } catch (error) {
      console.log(error);
      setError("Error fetching images");
    } finally {
      setLoading(false);
    }
  };
  // Fetch images from server
  useEffect(() => {
    fetchImages();
  }, []);
  const deleteImage = async (imageId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${baseURL}/local-files/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchImages();
    } catch (error) {
      console.log(error);
      setError("Error fetching images");
    } finally {
      setLoading(false);
    }
  };
  // Auto-slide logic
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      if (images && images.length > 0)
        setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  // Handle next slide
  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  // Handle previous slide
  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("fileUpload", file);

      try {
        const response = await axios.post(`${baseURL}/local-files`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await fetchImages();
      } catch (error) {
        console.error("Error uploading the file:", error);
      }
    }
  };

  const triggerFileInput = () => {
    document.getElementById("imageUpload").click();
  };
  return (
    <>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading && <p>Loading images...</p>}

      {/* Carousel Container */}
      {!loading && images.length > 0 && (
        <div className="relative w-full">
          {/* Carousel Wrapper */}
          <div className="relative h-80 overflow-hidden rounded-lg md:h-96">
            {images.map((file, index) => (
              <>
                <div
                  key={index}
                  className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
                    index === activeIndex ? "opacity-100" : "opacity-0"
                  } ${index === activeIndex ? "z-1" : "z-0"}`} // Ensure only the active slide is on top
                >
                  {/* Delete Button */}
                  {token && token != null && (
                    <button
                      type="button"
                      onClick={() => deleteImage(file.id)}
                      className="absolute top-2 right-2 p-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-full z-20"
                      aria-label="Delete image"
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

                  {/* Image */}
                  <img
                    src={`http://localhost:8000/${file.path[0].replace(
                      /^public\//,
                      ""
                    )}`}
                    className="w-full h-full object-cover"
                    alt={`Slide ${index + 1}`}
                  />
                </div>
              </>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
            {!loading &&
              images.length > 0 &&
              images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-3 h-3 rounded-full ${
                    i === activeIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></button>
              ))}
          </div>

          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="h-10 w-10 bg-white rounded-full top-1/2 absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
              ❮
            </span>
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="h-10 w-10 bg-white rounded-full top-1/2 absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
              ❯
            </span>
          </button>
        </div>
      )}
      {token && token != null && (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg ">
          <div key="btn" className="p-4 rounded-lg">
            <button
              onClick={triggerFileInput}
              type="button"
              class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Add New Image
            </button>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
