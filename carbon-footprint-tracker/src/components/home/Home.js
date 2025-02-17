// Home.js
import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [formData, setFormData] = useState({
    energyConsumption: '',
    waterUsage: '',
    wasteProduction: ''
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const checkSustainability = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiData = {
      input: {
        Company: 'Adidas', // Hardcoded for now, could be made dynamic
        Product_Type: 3,   // Hardcoded for now, could be made dynamic
        Energy_Consumption: Number(formData.energyConsumption),
        Water_Consumption: Number(formData.waterUsage),
        Waste_Generation: Number(formData.wasteProduction),
        Greenhouse_Gas_Emissions: 4000, // Hardcoded for now, could be made dynamic
        Pollutants_Emitted: 12         // Hardcoded for now, could be made dynamic
      }
    };

    try {
      const response = await fetch('http://localhost:5000/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sustainability data');
      }

      const data = await response.json();
      setResult(data.sustainabilityLevel);
    } catch (err) {
      setError('Failed to check sustainability. Please try again.');
      // For demo purposes, set a mock result
      setResult('moderately sustainable');
    } finally {
      setLoading(false);
    }
  };

  const getSustainabilityClass = () => {
    switch (result?.toLowerCase()) {
      case 'highly sustainable':
        return 'result-card highly-sustainable';
      case 'moderately sustainable':
        return 'result-card moderately-sustainable';
      case 'unsustainable':
        return 'result-card unsustainable';
      default:
        return 'result-card';
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            Manufacturing Process Sustainability Checker
          </h1>
        </div>
        <div className="card-content">
          <form onSubmit={checkSustainability} className="form">
            <div className="input-grid">
              <div className="input-group">
                <label className="input-label">
                  Energy Consumption (kWh)
                </label>
                <input
                  type="number"
                  name="energyConsumption"
                  value={formData.energyConsumption}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                  placeholder="Enter energy consumption"
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">
                  Water Usage (Liters)
                </label>
                <input
                  type="number"
                  name="waterUsage"
                  value={formData.waterUsage}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                  placeholder="Enter water usage"
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">
                  Waste Production (kg)
                </label>
                <input
                  type="number"
                  name="wasteProduction"
                  value={formData.wasteProduction}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                  placeholder="Enter waste production"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Checking...' : 'Check Sustainability'}
            </button>
          </form>

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          {result && (
            <div className={getSustainabilityClass()}>
              <h3 className="result-title">Sustainability Assessment</h3>
              <p className="result-text">Your process is: {result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;