import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import "../App.css"; // Assuming you have a CSS file for styling

function ImageUpload() {
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(''); // State for image preview
    const navigate = useNavigate(); // Initialize the navigate function
    const { logout } = useAuth(); // Get the logout function from AuthContext

    // Function to resize the image to 256x256 using canvas and convert to JPEG
    const resizeImageToJpeg = (file, callback) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 256;

                // Draw the image on the canvas to resize it
                ctx.drawImage(img, 0, 0, 256, 256);

                // Convert canvas back to a JPEG blob
                canvas.toBlob((blob) => {
                    const jpegFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });

                    // Callback to set the JPEG file
                    callback(jpegFile);
                }, 'image/jpeg');  // Force JPEG format
            };

            img.onerror = function () {
                console.error('Error loading image for resizing.');
            };
        };

        reader.onerror = function () {
            console.error('Error reading file for resizing.');
        };
    };

    // Handle image file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            console.error('No file selected');
            return;
        }

        // Resize image and then convert to JPEG
        resizeImageToJpeg(selectedFile, (jpegFile) => {
            setFile(jpegFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set the preview image
            };
            reader.readAsDataURL(jpegFile);
        });
    };

    // Handle form submission and send file to backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            // Prompt error message if no image is selected
            alert('Please select or capture an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Redirect to the Results page with the prediction and image preview
            navigate('/results', {
                state: {
                    prediction: response.data.prediction,
                    confidence: response.data.confidence,
                    severity: response.data.severity,
                    image: imagePreview,
                }
            });

        } catch (err) {
            console.error('Error occurred during prediction:', err);
            alert('An error occurred while processing the image. Please try again.');
        }
    };

    // Handle logout functionality
    const handleLogout = (e) => {
        e.preventDefault();
        logout(); // Call the logout function from AuthContext
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="image-upload-container">
            {/* Sidebar */}
            <div className="sidebar">
                <h2 className="sidebar-title">BananaGuard</h2> {/* Title at the top */}
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/logout" onClick={handleLogout}>Log Out</a></li> {/* Log Out link */}
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="flex-container">
                    {/* Upload Button */}
                    <div className="upload-section">
                        <label className="icon-button">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }} // Hidden file input
                            />
                            <div className="icon upload-icon"></div>
                            <span>Upload</span>
                        </label>
                    </div>

                    {/* Preview Image */}
                    <div className="image-preview-section">
                        {imagePreview ? (
                            <div className="image-preview">
                                <h3>Image Preview</h3>
                                <img src={imagePreview} alt="Selected" style={{ width: '256px', height: '256px', objectFit: 'contain' }} />
                            </div>
                        ) : (
                            <p>No Image Uploaded</p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <form onSubmit={handleSubmit} className="submit-form">
                    <button type="submit">Submit for Prediction</button>
                </form>
            </div>
        </div>
    );
}

export default ImageUpload;
