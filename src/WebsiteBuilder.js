import React, { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import gjsBlocksBootstrap4 from "grapesjs-blocks-bootstrap4";
import { useNavigate } from "react-router-dom";
import placeholder from "./images/placeholder.png";
import placeholderEvents from "./images/placeholder-events.png";
import placeholderCoachs from "./images/placeholder-coachs.png";
import axios from "axios";
const token = localStorage.getItem("token");
const baseURL = process.env.REACT_APP_BASEURL;

// Example data
const coaches = [
  {
    name: "John Doe",
    role: "Expert in Sports Training",
    img: "https://placehold.co/100x100/000000/FFF",
  },
];

const WebsiteBuilder = () => {
  const [errors, setErrors] = useState("");
  const [templateId, setTemplateId] = useState();
  const editorRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token == null) {
      navigate("/login");
    }
  }, []);

  // Save Design
  const saveDesign = async () => {
    const editor = editorRef.current;
    if (editor) {
      localStorage.setItem("savedHTML", editor.getHtml());
      localStorage.setItem("savedCSS", editor.getCss());
      setErrors("Design Saved.");

      const payload = {
        htmlContent: editor.getHtml(),
        cssContent: editor.getCss(),
      };
      try {
        console.log(templateId);
        if (templateId && templateId!==null && templateId!==undefined){
          const response = await axios.put(
            `${baseURL}/template/${templateId}`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          const response = await axios.post(
            `${baseURL}/template`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } catch (error) {
        console.error("Error updating template:", error);
      }
    }
  };

  // Load Design
  const loadDesign = async () => {
    const editor = editorRef.current;
    if (editor) {
      try {
        const response = await axios.get(`${baseURL}/template`);
        localStorage.setItem(
          "savedHTML",
          response.data.data.templates[0].htmlContent
        );
        localStorage.setItem(
          "savedCSS",
          response.data.data.templates[0].cssContent
        );
        setTemplateId(response.data.data.templates[0]._id);
        editor.setComponents(localStorage.getItem("savedHTML") || "");
        editor.setStyle(localStorage.getItem("savedCSS") || "");
        setErrors("Design Loaded.");
      } catch (error) {
        console.error("Error updating template:", error);
      }
    }
  };

  // Open Preview Page
  const openPreview = () => {
    navigate("/preview");
  };

  const signout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (!editorRef.current) {
      const editor = grapesjs.init({
        container: "#editor",
        height: "100vh",
        fromElement: true,
        storageManager: false,
        blockManager: { appendTo: "#blocks" },
        plugins: [gjsPresetWebpage, gjsBlocksBootstrap4],
      });

      editorRef.current = editor;

      // ✅ Add a Custom "CoachList" Block
      editor.BlockManager.add("custom-coach-list", {
        label: "Coach List",
        category: "Basic",
        content: {
          type: "custom-coach-list",
        },
      });
      // ✅ Add a Custom "Carousel" Block
      editor.BlockManager.add("custom-carousel", {
        label: "Custom Carousel",
        category: "Basic",
        content: {
          type: "custom-carousel",
        },
      });
      // ✅ Define the "custom-coach-list" Component Type
      editor.DomComponents.addType("custom-coach-list", {
        model: {
          defaults: {
            tagName: "section",
            attributes: {
              id: "coaches-section", // Assign the ID here using 'attributes'
            },
            classes: ["py-10", "bg-white", "px-10"],
            components: [
              {
                type: "text",
                tagName: "h2",
                content: "Our Coaches",
                classes: ["text-3xl", "font-bold", "text-center", "mb-6"],
              },
              {
                type: "custom-coach-list-container",
              },
            ],
          },
        },
      });

      // ✅ Custom component for Coach List container
      editor.DomComponents.addType("custom-coach-list-container", {
        model: {
          defaults: {
            tagName: "div",
            classes: ["coach-list-container"],
            components: coaches.map((coach) => ({
              type: "custom-coach",
              tagName: "div",
              components: [
                {
                  type: "image",
                  tagName: "img",
                  attributes: { src: placeholderCoachs, alt: coach.name },
                },
              ],
            })),
          },
        },
      });

      // ✅ Custom Coach Item Component
      editor.DomComponents.addType("custom-coach", {
        model: {
          defaults: {
            tagName: "div",
            classes: [
              "flex",
              "items-center",
              "bg-gray-200",
              "p-6",
              "rounded-lg",
              "shadow-md",
            ],
            components: [
              {
                type: "image",
                tagName: "img",
                classes: [
                  "w-24",
                  "h-24",
                  "square",
                  "rounded-lg",
                  "object-cover",
                  "mr-6",
                ],
              },
              {
                type: "text",
                tagName: "div",
                classes: ["ml-6"],
                content: `<h3 class="text-xl font-semibold"></h3><p class="text-gray-600"></p>`,
              },
            ],
          },
        },
      });

      // ✅ Define the "custom-carousel" Component Type
      editor.DomComponents.addType("custom-carousel", {
        model: {
          defaults: {
            tagName: "div",
            attributes: {
              id: "hero-section", // Assign the ID here using 'attributes'
              "data-carousel": "slide", // Assign data attribute for carousel behavior
            },
            classes: ["relative", "w-full"],
            components: [
              {
                type: "custom-carousel-wrapper",
              },
            ],
          },
        },
      });

      // ✅ Custom component for the Carousel Wrapper
      editor.DomComponents.addType("custom-carousel-wrapper", {
        model: {
          defaults: {
            tagName: "div",
            classes: [
              "relative",
              "h-80",
              "overflow-hidden",
              "rounded-lg",
              "md:h-96",
            ],
            components: [
              // You can loop through your images here, for example
              ["000000"].map((color, index) => ({
                type: "custom-carousel-slide",
                tagName: "div",
                attributes: {
                  "data-carousel-item": "",
                },
                classes: ["hidden", "duration-700", "ease-in-out"],
                components: [
                  {
                    type: "image",
                    tagName: "img",
                    attributes: {
                      src: placeholder,
                      alt: `Slide ${index + 1}`,
                    },
                    classes: [
                      "absolute",
                      "block",
                      "w-full",
                      "-translate-x-1/2",
                      "-translate-y-1/2",
                      "top-1/2",
                      "left-1/2",
                    ],
                  },
                ],
              })),
            ],
          },
        },
      });

      // ✅ Custom component for the Carousel Slide
      editor.DomComponents.addType("custom-carousel-slide", {
        model: {
          defaults: {
            tagName: "div",
            classes: ["hidden", "duration-700", "ease-in-out"],
            components: [],
          },
        },
      });

      // ✅ Custom component for the Carousel Dots
      editor.DomComponents.addType("custom-carousel-dots", {
        model: {
          defaults: {
            tagName: "div",
            classes: [
              "absolute",
              "z-30",
              "flex",
              "-translate-x-1/2",
              "bottom-5",
              "left-1/2",
              "space-x-3",
            ],
            components: [
              [...Array(5)].map((_, i) => ({
                type: "button",
                tagName: "button",
                classes: ["w-3", "h-3", "rounded-full", "bg-white"],
                attributes: {
                  "data-carousel-slide-to": i,
                },
              })),
            ],
          },
        },
      });

      // ✅ Custom component for the Carousel Previous Button
      editor.DomComponents.addType("custom-carousel-prev-button", {
        model: {
          defaults: {
            tagName: "button",
            classes: [
              "absolute",
              "top-0",
              "start-0",
              "z-30",
              "flex",
              "items-center",
              "justify-center",
              "h-full",
              "px-4",
              "cursor-pointer",
              "group",
              "focus:outline-none",
            ],
            attributes: {
              "data-carousel-prev": "",
            },
            components: [
              {
                type: "span",
                tagName: "span",
                classes: [
                  "inline-flex",
                  "items-center",
                  "justify-center",
                  "w-10",
                  "h-10",
                  "rounded-full",
                  "bg-white/30",
                  "group-hover:bg-white/50",
                ],
                content: "❮",
              },
            ],
          },
        },
      });

      // ✅ Custom component for the Carousel Next Button
      editor.DomComponents.addType("custom-carousel-next-button", {
        model: {
          defaults: {
            tagName: "button",
            classes: [
              "absolute",
              "top-0",
              "end-0",
              "z-30",
              "flex",
              "items-center",
              "justify-center",
              "h-full",
              "px-4",
              "cursor-pointer",
              "group",
              "focus:outline-none",
            ],
            attributes: {
              "data-carousel-next": "",
            },
            components: [
              {
                type: "span",
                tagName: "span",
                classes: [
                  "inline-flex",
                  "items-center",
                  "justify-center",
                  "w-10",
                  "h-10",
                  "rounded-full",
                  "bg-white/30",
                  "group-hover:bg-white/50",
                ],
                content: "❯",
              },
            ],
          },
        },
      });

      // ✅ Add a Custom "Event List" Block
      editor.BlockManager.add("custom-event-list", {
        label: "Event List",
        category: "Basic",
        content: {
          type: "custom-event-list", // The custom component type you defined
        },
      });

      // ✅ Define the "custom-event-list" Component Type
      editor.DomComponents.addType("custom-event-list", {
        model: {
          defaults: {
            tagName: "div",
            attributes: {
              id: "events-section", // Assign the ID here using 'attributes'
            },
            classes: [
              "max-w-3xl",
              "mx-auto",
              "bg-white",
              "p-6",
              "rounded-lg",
              "shadow-md",
            ],
            components: [
              {
                type: "text",
                tagName: "h2",
                content: "Upcoming Events", // Adjust the title if needed
                classes: ["text-2xl", "font-semibold", "mb-6"],
              },
              {
                type: "custom-event-list-container",
              },
            ],
          },
        },
      });

      // ✅ Custom component for Event List container
      editor.DomComponents.addType("custom-event-list-container", {
        model: {
          defaults: {
            tagName: "div",
            classes: ["grid", "grid-cols-1", "md:grid-cols-2", "gap-6"],
            components: [
              {
                type: "custom-event-item",
              },
              {
                type: "image",
                tagName: "img",
                attributes: {
                  src: placeholderEvents,
                  alt: `Placeholder`,
                },
                classes: [
                  "absolute",
                  "block",
                  "w-full",
                  "-translate-x-1/2",
                  "-translate-y-1/2",
                  "top-1/2",
                  "left-1/2",
                ],
              },
            ],
          },
        },
      });

      // ✅ Custom Event Item Component
      // editor.DomComponents.addType("custom-event-item", {
      //   model: {
      //     defaults: {
      //       tagName: "div",
      //       classes: ["p-4", "bg-blue-100", "rounded-lg"],
      //       components: [
      //         {
      //           type: "text",
      //           tagName: "h3",
      //           classes: ["text-lg", "font-semibold"],
      //           content: "Event Title", // Default content, can be replaced with dynamic content
      //         },
      //         {
      //           type: "text",
      //           tagName: "p",
      //           classes: ["text-gray-600"],
      //           content: "Date: 01/01/2025", // Default content, can be replaced with dynamic content
      //         },
      //       ],
      //     },
      //   },
      // });
    }
  }, []);

  return (
    <>
      <div style={{ padding: "10px", background: "#ddd" }}>
        {errors && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded-lg">
            {errors}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={saveDesign}
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Save
          </button>
          <button
            type="button"
            onClick={loadDesign}
            className="mx-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Load
          </button>
          <button
            type="button"
            onClick={openPreview}
            className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={signout}
            className="mx-3 text-white bg-red-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div
          id="blocks"
          style={{ width: "200px", background: "#f5f5f5", padding: "10px" }}
        ></div>
        <div id="editor" style={{ flexGrow: 1 }}></div>
      </div>
    </>
  );
};

export default WebsiteBuilder;
