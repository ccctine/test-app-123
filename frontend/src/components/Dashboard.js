import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';
import '../Dashboard.css';

const Dashboard = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await fetch('http://localhost:5000/fetch-results');
            if (!response.ok) {
                throw new Error('Failed to fetch results');
            }
            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);
    const totalPages = Math.ceil(results.length / resultsPerPage);

    const extractRecommendationDetails = (recommendation) => {
        const symptomsMatch = recommendation.match(/Symptoms:\s*([^\n]+)(?=\s*Treatment:)/i);
        const treatmentMatch = recommendation.match(/Treatment:\s*([^\n]+)(?=\s*Prevention:)/i);
        const preventionMatch = recommendation.match(/Prevention:\s*([^\n]+)(?=\s*Higher Risk Season:)/i);
        const seasonMatch = recommendation.match(/Higher Risk Season:\s*([^\n]+)/i);

        return {
            symptoms: symptomsMatch ? symptomsMatch[1].trim() : 'N/A',
            treatment: treatmentMatch ? treatmentMatch[1].trim() : 'N/A',
            prevention: preventionMatch ? preventionMatch[1].trim() : 'N/A',
            season: seasonMatch ? seasonMatch[1].trim() : 'N/A'
        };
    };

    const generatePDFReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Banana Disease Report Summary', 20, 20);

        currentResults.forEach((result, index) => {
            const { symptoms, treatment, prevention, season } = extractRecommendationDetails(result.recommendation);
            doc.text(`${index + 1}. Disease: ${result.predicted_disease}`, 20, 30 + index * 20);
            doc.text(`Symptoms: ${symptoms}`, 20, 40 + index * 20);
            doc.text(`Treatment: ${treatment}`, 20, 50 + index * 20);
            doc.text(`Prevention: ${prevention}`, 20, 60 + index * 20);
            doc.text(`Higher Risk Season: ${season}`, 20, 70 + index * 20);
            doc.text('------------------------------', 20, 80 + index * 20);
        });

        doc.save('report_summary.pdf');
    };

    const generateCSVReport = () => {
        const tableData = results.map(result => {
            const { symptoms, treatment, prevention, season } = extractRecommendationDetails(result.recommendation);
            return {
                Timestamp: result.timestamp,
                Disease: result.predicted_disease,
                Confidence: result.confidence || 'N/A',
                Severity: result.severity || 'N/A',
                Symptoms: symptoms,
                Treatment: treatment,
                Prevention: prevention,
                HigherRiskSeason: season            };
        });

        const csv = Papa.unparse(tableData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'full_table_report.csv');
        link.click();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2 className="sidebar-title">BananaGuard</h2>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/logout" onClick={logout}>Log Out</a></li>
                </ul>
            </div>

            <div className="results-content">
                <h2>Results Dashboard</h2>
                <button className='button-go-back' onClick={() => navigate('/upload')}>Go Back to Upload</button>
                <button className='button-generate-csv' onClick={generateCSVReport}>Generate Report</button>

                <div className="results-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Disease</th>
                                <th>Confidence (%)</th>
                                <th>Severity</th>
                                <th>Symptoms</th>
                                <th>Treatment</th>
                                <th>Prevention</th>
                                <th>Higher Risk Season</th>
                                <th>Uploaded Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentResults.map((result) => {
                                const { symptoms, treatment, prevention, season } = extractRecommendationDetails(result.recommendation);
                                return (
                                    <tr key={`${result.id}-${result.timestamp}`}>
                                        <td>{result.timestamp}</td>
                                        <td>
                                            <a 
                                                href="#" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate('/results', { state: { 
                                                        prediction: result.predicted_disease, 
                                                        confidence: result.confidence, 
                                                        severity: result.severity, 
                                                        image: result.uploaded_image 
                                                    }}); 
                                                }}
                                            >
                                                {result.predicted_disease}
                                            </a>
                                        </td>
                                        <td>{result.confidence || 'N/A'}</td>
                                        <td>{result.severity || 'N/A'}</td>
                                        <td>{symptoms}</td>
                                        <td>{treatment}</td>
                                        <td>{prevention}</td>
                                        <td>{season}</td>
                                        <td>
                                            <img src={result.uploaded_image} alt="Uploaded" style={{ maxWidth: '100px', height: 'auto' }} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button 
                            key={index + 1} 
                            onClick={() => setCurrentPage(index + 1)} 
                            disabled={currentPage === index + 1}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
