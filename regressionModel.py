import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from sklearn.metrics import accuracy_score
 
# Function to train and predict sustainability
def train_and_predict_sustainability(input_features):
    # Load dataset
    df = pd.read_csv('Plastic based Textiles in clothing industry.csv')
 
    # Calculating median values for sustainability criteria
    median_values = {
        "Greenhouse_Gas_Emissions": df["Greenhouse_Gas_Emissions"].median(),
        "Pollutants_Emitted": df["Pollutants_Emitted"].median(),
        "Water_Consumption": df["Water_Consumption"].median(),
        "Energy_Consumption": df["Energy_Consumption"].median(),
        "Waste_Generation": df["Waste_Generation"].median()
    }
 
    # Function to determine sustainability
    def is_sustainable(row):
        conditions_met = sum([
            row["Greenhouse_Gas_Emissions"] <= median_values["Greenhouse_Gas_Emissions"],
            row["Pollutants_Emitted"] <= median_values["Pollutants_Emitted"],
            row["Water_Consumption"] <= median_values["Water_Consumption"],
            row["Energy_Consumption"] <= median_values["Energy_Consumption"],
            row["Waste_Generation"] <= median_values["Waste_Generation"]
        ])
        return "Yes" if conditions_met >= 2 else "No"
 
    # Apply function to dataset
    df["Sustainable"] = df.apply(is_sustainable, axis=1)
 
    # Encoding categorical columns
    label_encoder = LabelEncoder()
    df["Product_Type"] = label_encoder.fit_transform(df["Product_Type"])
    df["Company"] = label_encoder.fit_transform(df["Company"])
    # Selecting numerical columns for normalization
    numerical_cols = [
        'Company',
        "Product_Type",
        "Greenhouse_Gas_Emissions", 
        "Pollutants_Emitted", 
        "Water_Consumption", 
        "Energy_Consumption", 
        "Waste_Generation"
    ]
    # Applying Min-Max Scaling
    scaler = MinMaxScaler()
    df[numerical_cols] = scaler.fit_transform(df[numerical_cols])
 
    # Preparing input and output variables
    X = df[numerical_cols]
    df['Sustainable'] = df['Sustainable'].replace({'Yes': 1, 'No': 0})
    y = df['Sustainable']
 
    # Splitting dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
 
    # Training the logistic regression model
    model = LogisticRegression(C=10, max_iter=100, penalty='l1', solver='liblinear', random_state=0)
    model.fit(X_train, y_train)
 
    # Model Accuracy
    accuracy = accuracy_score(y_test, model.predict(X_test))
    print(f"Model Accuracy: {accuracy:.2f}")
 
    # Transform input features into a DataFrame
    input_df = pd.DataFrame([input_features], columns=numerical_cols)
    input_df["Product_Type"] = label_encoder.fit_transform(input_df["Product_Type"])
    input_df["Company"] = label_encoder.fit_transform(input_df["Company"])
 
    # Scale the input features
    input_df = scaler.transform(input_df)
 
    # Predict sustainability (0 = Not Sustainable, 1 = Sustainable)
    prediction = model.predict(input_df)
    return prediction[0]  # Return 0 or 1
# if __name__ == "__main__":

# # Example Usage:
#   input_data = {
#     "Company" : 'Adidas',
#     "Product_Type": 3,              # Replace with encoded value
#     "Greenhouse_Gas_Emissions": 4000, 
#     "Pollutants_Emitted": 12, 
#     "Water_Consumption": 5000, 
#     "Energy_Consumption": 1000, 
#     "Waste_Generation": 200
#   }
 
# # Predict if the company is sustainable
# sustainability_prediction = train_and_predict_sustainability(input_data)
# print("Sustainability Prediction:", "Sustainable" if sustainability_prediction == 1 else "Not Sustainable")