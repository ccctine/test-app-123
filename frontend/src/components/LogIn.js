import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const LogIn = () => {
  const { login } = useAuth(); // Use the login method from context
  const [identifier, setIdentifier] = useState(""); // Changed to identifier
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook to handle navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }), // Send identifier
      });

      const data = await response.json();

      if (response.ok) {
        login(); // Call the login method to set authentication state
        navigate("/upload"); // Redirect to the ImageUpload page
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username or Email" // Updated placeholder
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)} // Change state to identifier
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
