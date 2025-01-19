// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ImageUpload from './components/ImageUpload';
import LogIn from './components/LogIn';
import Register from './components/Register'; // Ensure this import is present
import Results from './components/Results';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext'; // Make sure AuthProvider is imported
import './App.css';

function App() {
  return (
    <AuthProvider> {/* AuthProvider wraps the whole application */}
      <Router> {/* Only one Router here */}
        <div className="App">
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/register" element={<Register />} /> {/* New Register route */}
              <Route 
                path="/upload" 
                element={
                  <PrivateRoute>
                    <ImageUpload />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/results" 
                element={
                  <PrivateRoute>
                    <Results />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
