import React, {use, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === "email") {
        setEmail(value);
      } else if (name === "password") {
        setPassword(value);
      }
    };
  
    // Validate form inputs
    const validateForm = () => {
      let formErrors = {};
      if (!email) formErrors.email = "Email is required!";
      if (!password) formErrors.password = "Password is required!";
      return formErrors;
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formErrors = validateForm();
  
      if (Object.keys(formErrors).length === 0) {
        // If no validation errors, make API request
        try {
          const response = await axios.post(
            `${baseURL}/auth/login`,  // Replace with your login API endpoint
            {
              email: email,
              password: password,
            },
            {
              headers: {
                "Content-Type": "application/json", // Ensure proper content type
              },
            }
          );
          
          // Assuming the API returns a response with user data or a token
          console.log("Login successful:", response.data);
          // Perform any further actions, like storing the token in localStorage or redirecting
          localStorage.setItem("token", response.data.data.token);  // Example: Store token
  
          // Reset form fields after successful login
          setEmail("");
          setPassword("");
          navigate("/")
        } catch (error) {
          console.error("Error during login:", error);
          setErrors({
            api: "Invalid credentials or something went wrong. Please try again.",
          });
        }
      } else {
        setErrors(formErrors);
      }
    };
  

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {errors?.api && (
                <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
                    {errors.api}
                </div>
            )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        
        <div className="mb-4">
          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Log In
          </button>
        </div>
      </form>
      <div className="text-center text-sm text-gray-600">
        {/* <p>Don't have an account? <a href="/register" className="text-blue-600">Sign up</a></p> */}
      </div>
    </div>
  );
};

export default Login;
