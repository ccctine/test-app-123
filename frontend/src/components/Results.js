import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import '../Results.css'; // Ensure this includes all necessary styles

const recommendations = {
    'Banana Aphids': {
        symptoms: [
            'Yellowing and curling of leaves: Aphids feed on sap, leading to leaf discoloration and distortion.',
            'Stunted plant growth: Heavy infestations reduce growth and vigor.',
            'Honeydew secretion: Sticky substance that promotes sooty mold growth on leaves and attracts ants.',
            'Bunched leaves: Aphids can spread the Banana Bunchy Top Virus (BBTV), causing leaves to bunch at the top.'
        ],
        treatment: 'Insecticidal Soap or Oil. Systemic Insecticides. Biological Control.',
        prevention: `Regular Monitoring. Remove Weeds. Plant Resistant Varieties. Mulching. Control Ants.`,
        riskSeason: 'Dry Season: Aphid populations typically increase in dry conditions, which also makes plants more susceptible to BBTV transmission'
    },
    'Black Sigatoka': {
        symptoms: [
            'Dark streaks on leaves: Small, dark, elongated streaks on the undersides of older leaves.',
            'Yellowing around streaks: Streaks expand with yellowing around them.',
            'Leaf necrosis: The dark streaks coalesce, causing large areas of dead tissue.',
            'Premature leaf death: Leaves dry out and die, affecting photosynthesis.'
        ],
        treatment: 'Fungicide applications can help control Black Sigatoka, but the disease has developed resistance to some chemicals. Rotate fungicides with different modes of action to prevent resistance.',
        prevention: 'Remove and destroy infected leaves to reduce the source of fungal spores. Use resistant or tolerant banana varieties if available. Ensure proper plant spacing to allow air circulation and reduce humidity. Apply foliar sprays with fungicides (e.g., strobilurins, triazoles). Implement cultural practices like pruning and de-leafing to reduce disease spread.',
        riskSeason: 'Rainy Season: The spread of Black Sigatoka is favored by high humidity and frequent rain, which help spores spread and germinate on wet leaf surfaces.'
    },
    'Erwinia Rot': {
        symptoms: [
            'Water-soaked lesions: Initially small, water-soaked areas on leaves or pseudostem.',
            'Soft, mushy tissue: Infected areas become soft and emit a foul odor as they decay.',
            'Wilting and collapse: Plants may suddenly wilt and fall over, especially in waterlogged areas.',
            'Rotting pseudostem: The infection spreads to the pseudostem, causing internal tissue breakdown.'
        ],
        treatment: 'Apply copper-based bactericides or disinfectants to slow the spread of soft rot, though effectiveness may be limited.',
        prevention: 'Avoid injury to the plants, as the bacterium enters through wounds. Ensure good drainage to reduce wet conditions that promote bacterial growth. Remove and destroy infected plant tissues. Maintain proper plant spacing for adequate air circulation. Sterilize tools and equipment between uses to avoid spreading the bacteria.',
        riskSeason: 'Rainy Season: Erwinia rot thrives in waterlogged conditions, which makes the rainy season the peak period for bacterial spread and rot development.'

    },
    'Healthy': {
        symptoms: 'N/A',
        treatment: 'N/A',
        prevention: 'N/A',
        riskSeason: 'N/A'

    },
    'Panama Disease': {
        symptoms: [
            'Yellowing of older leaves: The oldest leaves begin to yellow and wilt.',
            'Splitting at the pseudostem base: Vertical splits may appear near the pseudostem’s base.',
            'Internal vascular discoloration: Cutting through the pseudostem reveals reddish-brown discoloration.',
            'Complete wilting: The whole plant wilts and collapses as the disease progresses.'
        ],
        treatment: 'There is no effective chemical treatment for Panama disease once it infects a plant. Infected plants should be uprooted and destroyed to prevent further spread.',
        prevention: 'Use disease-resistant varieties (though the Cavendish is highly susceptible). Implement strict sanitation measures, such as cleaning tools and machinery after working in infected fields. Apply crop rotation with non-host crops like rice or maize to reduce pathogen levels in the soil. Maintain good drainage to prevent waterlogging and reduce disease severity. Biosecurity practices to prevent movement of contaminated soil and plant material.',
        riskSeason: 'Dry Season: Panama Disease is soil-borne and doesn’t require high humidity, often spreading more during dry seasons when plants are stressed and irrigation or human activity spreads soil particles.'
    },
    'Pseudostem Weevil': {
        symptoms: [
            'Small holes in the pseudostem: Adult weevils bore holes to lay eggs.',
            'Sawdust-like frass: Larvae feed inside, leaving sawdust-like residue around the plant base.',
            'Wilting and yellowing leaves: Internal damage from feeding larvae weakens the plant.',
            'Collapsed pseudostem: Severe infestation causes the pseudostem to collapse.'
        ],
        treatment: 'Insecticide Application. Biological Control. Trapping.',
        prevention: 'Sanitation. Planting Healthy Suckers. Monitoring and Early Detection. Mulching. ',
        riskSeason: 'Dry Season: Weevils prefer dry conditions, as they are less active in high humidity and rain, which reduces mobility.'
    },
    'Yellow Sigatoka': {
        symptoms: [
            'Yellow streaks on leaves: Small yellow streaks appear initially on older leaves.',
            'Brown or black spots: Streaks develop into brown or black spots as the disease progresses.',
            'Leaf necrosis: The spots merge into large patches of dead tissue.',
            'Premature leaf death: Leaves die early, affecting plant productivity.'
        ],
        treatment: 'Fungicide Application. Remove Infected Leaves. Use Resistant Varieties.',
        prevention: 'Good Field Sanitation. Improve Air Circulation. Monitor Humidity Levels. Plant Nutrition.',
        riskSeason: 'Rainy Season: Yellow Sigatoka spreads most during the rainy season when spores can move and germinate in moist, humid conditions.'
    },
    'Banana Moko': {
        symptoms: [
            'Wilting of leaves: Leaves start to wilt from the lower part of the plant upwards. Wilting can be sudden and may affect one side of the plant first.',
            'Chlorosis (yellowing): Older leaves turn yellow and collapse, hanging down the pseudostem.',
            'Internal discoloration: Cutting through the pseudostem or fruit reveals dark brown or reddish-brown streaks in the vascular tissues, a key symptom of Moko.',
            'Premature fruit ripening: Infected fruits may ripen unevenly or prematurely, with symptoms of internal rot.',
            'Stem and flower rot: The male bud (banana heart) may show signs of wilting and rot, and infected flowers may fall prematurely.',
            'Vascular streaking: Streaks appear in the vascular tissue of the pseudostem, similar to other bacterial wilts.',
            'Fruit Symptoms: The fruit itself can develop a brown or black internal discoloration, making it inedible.'
        ],
        treatment: 'Antibiotic. Copper-based bactericides. Cut-and-burn method.',
        prevention: 'Use of certified disease-free planting materials. Good field sanitation.',
        riskSeason: 'Dry season'
    }
    // Continue updating other diseases similarly...
};

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const { 
        prediction = 'No prediction available', 
        confidence = 'N/A', 
        severity = 'N/A', 
        image 
    } = location.state || {};

    useEffect(() => {
        console.log("Fetched location state:", location.state);
        console.log("Prediction: ", prediction);
        console.log("Confidence: ", confidence);
        console.log("Severity: ", severity);
    }, [location.state]);

    const confidenceDisplay = (typeof confidence === 'number' || !isNaN(Number(confidence))) 
        ? Number(confidence).toFixed(2) 
        : 'N/A';

    const { treatment, prevention, symptoms = [], riskSeason } = recommendations[prediction] || { treatment: 'No treatment available', prevention: 'No prevention available', symptoms: [], riskSeason: 'N/A' };

    // State for editing treatment and prevention
    const [editableTreatment, setEditableTreatment] = useState(treatment);
    const [editablePrevention, setEditablePrevention] = useState(prevention);
    const [isEditingTreatment, setIsEditingTreatment] = useState(false);
    const [isEditingPrevention, setIsEditingPrevention] = useState(false);

    const handleSave = async () => {
        const newResult = {
            timestamp: new Date().toLocaleString(),
            disease: prediction,
            recommendation: `Symptoms: ${symptoms.join(', ')}\nTreatment: ${editableTreatment}\nPrevention: ${editablePrevention}\nHigher Risk Season: ${riskSeason}`,
            uploaded_image: image,
            severity,
            confidence: confidenceDisplay
        };

        try {
            const response = await fetch('http://localhost:5000/save-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newResult),
            });

            if (response.ok) {
                alert("Results saved successfully!");
            } else {
                alert("Failed to save results.");
            }
        } catch (error) {
            console.error("Error saving results:", error);
        }
    };

    const handleRetry = () => {
        navigate('/upload');
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    const handleEditTreatment = () => {
        setIsEditingTreatment(true);
    };

    const handleEditPrevention = () => {
        setIsEditingPrevention(true);
    };

    const handleSaveTreatment = () => {
        setIsEditingTreatment(false);
    };

    const handleSavePrevention = () => {
        setIsEditingPrevention(false);
    };

    const handleCancelTreatment = () => {
        setEditableTreatment(treatment);
        setIsEditingTreatment(false);
    };

    const handleCancelPrevention = () => {
        setEditablePrevention(prevention);
        setIsEditingPrevention(false);
    };

    return (
        <div className="results-container">
            <div className="sidebar">
                <h2 className="sidebar-title">BananaGuard</h2>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/logout" onClick={handleLogout}>Log Out</a></li>
                </ul>
            </div>

            <div className="content">
                <div className="result-flexbox">
                    {image && (
                        <div className="uploaded-image">
                            <img src={image} alt="Uploaded" />
                        </div>
                    )}

                    <div className="details">
                        <h2>Predicted Disease: {prediction}</h2>
                        <h3>Confidence: {confidenceDisplay}%</h3>
                        <h3>Severity: {severity}</h3>
                        <div className="symptoms">
                            <h3>Symptoms:</h3>
                            {symptoms.map((symptom, index) => (
                                <p key={index}>{symptom}</p>
                            ))}
                        </div>

                        <div className="treatment">
                            <h3>Treatment:</h3>
                            {isEditingTreatment ? (
                                <>
                                    <textarea 
                                        value={editableTreatment} 
                                        onChange={(e) => setEditableTreatment(e.target.value)} 
                                    />
                                    <button onClick={handleSaveTreatment}>Save</button>
                                    <button onClick={handleCancelTreatment}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <p>{editableTreatment}</p>
                                    <button onClick={handleEditTreatment}>Edit</button>
                                </>
                            )}
                        </div>

                        <div className="prevention">
                            <h3>Prevention:</h3>
                            {isEditingPrevention ? (
                                <>
                                    <textarea 
                                        value={editablePrevention} 
                                        onChange={(e) => setEditablePrevention(e.target.value)} 
                                    />
                                    <button onClick={handleSavePrevention}>Save</button>
                                    <button onClick={handleCancelPrevention}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <p>{editablePrevention}</p>
                                    <button onClick={handleEditPrevention}>Edit</button>
                                </>
                            )}
                        </div>

                        <div className="risk-season">
                            <h3>Higher Risk Season:</h3>
                            <p>{riskSeason}</p>
                        </div>
                    </div>
                </div>

                <div className="button-container">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleRetry}>Retry</button>
                </div>
            </div>
        </div>
    );
};

export default Results;
