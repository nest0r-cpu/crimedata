from flask import Flask, jsonify
import requests
import pandas as pd

app = Flask(__name__)

# API Endpoint from SF Open Data
SF_CRIME_API = "https://data.sfgov.org/resource/wg3w-h783.json?$limit=1000"

def fetch_crime_data():
    response = requests.get(SF_CRIME_API)
    if response.status_code == 200:
        return response.json()
    return []

@app.route('/crime-data', methods=['GET'])
def get_crime_data():
    data = fetch_crime_data()
    df = pd.DataFrame(data)

    # Select relevant columns
    columns = ["incident_date", "incident_category", "police_district", "latitude", "longitude"]
    df = df[columns].dropna()

    return jsonify(df.to_dict(orient="records"))

if __name__ == '__main__':
    app.run(debug=True)
