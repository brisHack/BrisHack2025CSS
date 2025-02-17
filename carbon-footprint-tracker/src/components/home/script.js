document.addEventListener('DOMContentLoaded', function () {
    const formData = {
        energyConsumption: '',
        waterUsage: '',
        wasteProduction: ''
    };

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

    let currentBackground = 0;
    const appElement = document.getElementById('app');

    // Set the initial background image right away
    appElement.style.backgroundImage = `url(${images[currentBackground]})`;

    // Change the background image every 5 seconds
    setInterval(() => {
        currentBackground = (currentBackground + 1) % images.length;
        console.log(`Setting background: ${images[currentBackground]}`); // Log the current image
        appElement.style.backgroundImage = `url(${images[currentBackground]})`;
    }, 5000);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        formData[id] = value;
    };

    const checkSustainability = async (e) => {
        e.preventDefault();

        const submitButton = document.getElementById('submit-button');
        const errorMessage = document.getElementById('error-message');
        const resultContainer = document.getElementById('result');
        const resultText = document.getElementById('result-text');

        submitButton.disabled = true;
        errorMessage.style.display = 'none';
        resultContainer.style.display = 'none';

        try {
            // Replace this URL with your actual API endpoint
            const response = await fetch('YOUR_API_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch sustainability data');
            }

            const data = await response.json();
            setResult(data.sustainabilityLevel);
        } catch (err) {
            errorMessage.textContent = 'Failed to check sustainability. Please try again.';
            errorMessage.style.display = 'block';
            // For demo purposes, set a mock result
            setResult('moderately sustainable');
        } finally {
            submitButton.disabled = false;
        }
    };

    const setResult = (result) => {
        const resultContainer = document.getElementById('result');
        const resultText = document.getElementById('result-text');
        resultText.textContent = `Your process is: ${result}`;

        resultContainer.style.display = 'block';

        const resultClass = getSustainabilityClass(result);
        resultContainer.className = `result-card ${resultClass}`;
    };

    const getSustainabilityClass = (result) => {
        switch (result?.toLowerCase()) {
            case 'highly sustainable':
                return 'highly-sustainable';
            case 'moderately sustainable':
                return 'moderately-sustainable';
            case 'unsustainable':
                return 'unsustainable';
            default:
                return '';
        }
    };

    document.getElementById('sustainability-form').addEventListener('submit', checkSustainability);
    document.getElementById('energyConsumption').addEventListener('input', handleInputChange);
    document.getElementById('waterUsage').addEventListener('input', handleInputChange);
    document.getElementById('wasteProduction').addEventListener('input', handleInputChange);
});
