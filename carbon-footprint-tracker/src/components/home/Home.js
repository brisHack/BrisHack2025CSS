import React, { useState, useEffect } from 'react';
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

  const [currentBackground, setCurrentBackground] = useState(0);

  // Array of background images
  const images = [
    '/background/image1.jpg',
    '/background/image2.jpg',
    '/background/image3.jpg',
    '/background/image4.jpg',
    '/background/image5.jpg',
    '/background/image6.jpg',
    '/background/image7.jpg',
    '/background/image8.jpg',
    '/background/image9.jpg',
    '/background/image10.jpg',
    '/background/image11.jpg',
    '/background/image12.jpg',
    '/background/image13.jpg',
    '/background/image14.jpg',
    '/background/image15.jpg',
    '/background/image16.jpg',
    '/background/image17.jpg'
  ];

  // Change the background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 5 seconds interval

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
      <div className="container" style={{ backgroundImage: `url(${images[currentBackground]})` }}>
        <header>
          <div className="logo">
            <h1>Sustainable Fashion</h1>
          </div>
          <nav>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </header>

        <section className="hero">
          <h2>Join the Sustainable Fashion Movement</h2>
          <p>Discover eco-conscious fashion that looks good and does good.</p>
        </section>

        {/* Manufacturing Process Sustainability Checker Section */}
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Manufacturing Process Sustainability Checker</h1>
          </div>
          <div className="card-content">
            <form onSubmit={checkSustainability} className="form">
              <div className="input-grid">
                <div className="input-group">
                  <label className="input-label">Energy Consumption (kWh)</label>
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
                  <label className="input-label">Water Usage (Liters)</label>
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
                  <label className="input-label">Waste Production (kg)</label>
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

              <button type="submit" disabled={loading} className="submit-button">
                {loading ? 'Checking...' : 'Check Sustainability'}
              </button>
            </form>

            {error && <div className="alert error">{error}</div>}

            {result && (
                <div className={getSustainabilityClass()}>
                  <h3 className="result-title">Sustainability Assessment</h3>
                  <p className="result-text">Your process is: {result}</p>
                </div>
            )}
          </div>
        </div>

        <footer>
          <p>&copy; 2025 Sustainable Fashion. All rights reserved.</p>
        </footer>
      </div>
  );
};

export default Home;
