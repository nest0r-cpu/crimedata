// Initialize the map
const map = L.map('heatmap-container').setView([37.7749, -122.4194], 13);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Initialize the heat layer
let heatLayer = null;

// Function to fetch and process crime data
async function fetchCrimeData(timeRange) {
    try {
        // Calculate the date range
        const endDate = new Date();
        const startDate = new Date();
        switch (timeRange) {
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '60d':
                startDate.setDate(startDate.getDate() - 60);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
        }

        // Format dates for the API
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        // Build the API query
        let query = `https://data.sfgov.org/resource/wg3w-h783.json?$where=incident_date BETWEEN '${startDateStr}' AND '${endDateStr}' AND latitude IS NOT NULL AND longitude IS NOT NULL`;

        // Add limit to prevent overwhelming the API
        query += '&$limit=10000';

        console.log('Fetching data from:', query); // Debug log

        const response = await fetch(query);
        const data = await response.json();

        console.log('Received data points:', data.length); // Debug log

        // Process the data for the heat map
        const heatData = data.map(incident => [
            parseFloat(incident.latitude),
            parseFloat(incident.longitude),
            1 // intensity (can be adjusted based on crime severity)
        ]);

        console.log('Processed heat data points:', heatData.length); // Debug log
        return heatData;
    } catch (error) {
        console.error('Error fetching crime data:', error);
        return [];
    }
}

// Function to update the heat map
async function updateHeatMap(timeRange) {
    // Remove existing heat layer if it exists
    if (heatLayer) {
        map.removeLayer(heatLayer);
    }

    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading data...';
    document.getElementById('heatmap-section').appendChild(loadingIndicator);

    try {
        // Fetch and process data
        const heatData = await fetchCrimeData(timeRange);

        // Remove loading indicator
        loadingIndicator.remove();

        if (heatData.length === 0) {
            console.log('No data points to display'); // Debug log
            return;
        }

        // Create new heat layer with adjusted parameters
        heatLayer = L.heatLayer(heatData, {
            radius: 15, // reduced radius for better visualization
            blur: 10, // reduced blur for sharper edges
            maxZoom: 10,
            max: 1.0,
            gradient: {
                0.2: 'blue',
                0.4: 'cyan',
                0.6: 'yellow',
                0.8: 'orange',
                1.0: 'red'
            }
        }).addTo(map);

        // Fit the map to show all points
        const bounds = L.latLngBounds(heatData.map(point => [point[0], point[1]]));
        map.fitBounds(bounds, { padding: [50, 50] });

        console.log('Heat map updated successfully'); // Debug log
    } catch (error) {
        console.error('Error updating heat map:', error);
        loadingIndicator.remove();
    }
}

// Event listener for time range control
document.getElementById('timeRange').addEventListener('change', (e) => {
    const timeRange = e.target.value;
    updateHeatMap(timeRange);
});

// Initial heat map load
document.addEventListener('DOMContentLoaded', () => {
    updateHeatMap('7d');
}); 