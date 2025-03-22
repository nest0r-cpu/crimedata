from flask import Flask, jsonify
import requests

app = Flask(__name__)

# ✅ Correct API Endpoint
SF_CRIME_API_URL = "https://data.sfgov.org/resource/gnap-fj3t.json?$limit=1000"

def fetch_crime_data():
    """Fetch real-time crime data from SF Open Data API."""
    try:
        response = requests.get(SF_CRIME_API_URL)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching crime data: {e}")
        return []

@app.route('/crime-data', methods=['GET'])
def get_crime_data():
    """API route to return formatted crime data."""
    data = fetch_crime_data()

    formatted_data = []
    for incident in data:
        formatted_data.append({
            "incident_date": incident.get("call_date_time", "Unknown"),
            "category": incident.get("call_type", "Unknown"),
            "description": incident.get("call_type_group", "Unknown"),
            "resolution": incident.get("disposition", "Unknown"),
            "latitude": incident.get("latitude"),
            "longitude": incident.get("longitude"),
            "address": incident.get("address", "Unknown"),
        })

    return jsonify(formatted_data)

if __name__ == '__main__':
    app.run(debug=True)
