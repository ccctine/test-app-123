// src/Home.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../App.css'; // Ensure this imports your CSS styles

const Home = () => {
  return (
    <Link to="/login" className="home-container"> {/* Change to /login */}
      <div className="overlay" />
      <div className="text">
      BananaGuard: A Smart System for Early Detection and Management of Banana Disease <br></br>
      <br></br>
      <br></br>
      <br></br>

      Click to Start
      </div>
    

 
    </Link>
  );
};

export default Home;
