from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from temp import train_and_predict_sustainability

app = Flask(__name__)

# Enable CORS for all routes and origins explicitly
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

# Replace this function with your own processing code.

def process_data(data):
    # Example: reverse the input string if it's a string
    if isinstance(data, str):
         input_data = {
    "Company" : 'Adidas',
    "Product_Type": 3,              # Replace with encoded value
    "Greenhouse_Gas_Emissions": 4000, 
    "Pollutants_Emitted": 12, 
    "Water_Consumption": 5000, 
    "Energy_Consumption": 1000, 
    "Waste_Generation": 200
  }
        
    return train_and_predict_sustainability(data)

@app.route('/api/process', methods=['POST'])
def api_process():
    try:
        # Get JSON data from the request
        content = request.get_json(force=True)
        if not content or 'input' not in content:
            return jsonify({'error': 'Please provide an "input" field in the JSON payload.'}), 400

        input_data = content['input']
        result = process_data(input_data)
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the Flask development server
    app.run(debug=True, host='0.0.0.0', port=5000)
