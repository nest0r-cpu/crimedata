document.addEventListener("DOMContentLoaded", function () {
    var map = L.map("map-container").setView([37.7749, -122.4194], 12);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    fetch("http://127.0.0.1:5000/crime-data")
        .then(response => response.json())
        .then(data => {
            data.forEach(crime => {
                if (crime.latitude && crime.longitude) {
                    L.marker([parseFloat(crime.latitude), parseFloat(crime.longitude)])
                        .bindPopup(`<b>${crime.incident_category}</b><br>${crime.incident_date}`)
                        .addTo(map);
                }
            });
        })
        .catch(error => console.error("Error loading map data:", error));
});
