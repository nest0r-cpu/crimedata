document.addEventListener("DOMContentLoaded", async function () {
    const apiUrl = "https://data.sfgov.org/resource/wg3w-h783.json?$limit=1000&$where=latitude IS NOT NULL AND longitude IS NOT NULL";

    async function fetchCrimeData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching crime data:", error);
        }
    }

    async function generateMap() {
        const map = L.map("map-container").setView([37.7749, -122.4194], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        const data = await fetchCrimeData();
        if (!data) return;

        data.forEach((incident) => {
            const lat = parseFloat(incident.latitude);
            const lon = parseFloat(incident.longitude);
            const description = incident.incident_description || "No Description";

            L.marker([lat, lon]).addTo(map)
                .bindPopup(`<b>${incident.incident_category}</b><br>${description}`);
        });
    }

    generateMap();
});
