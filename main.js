document.addEventListener("DOMContentLoaded", async function () {
    const apiUrl = "https://data.sfgov.org/resource/wg3w-h783.json?$limit=1000";

    async function fetchCrimeData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching crime data:", error);
        }
    }

    async function generateChart() {
        const data = await fetchCrimeData();
        if (!data) return;

        const crimeCounts = {};
        data.forEach((incident) => {
            const category = incident.incident_category || "Unknown";
            crimeCounts[category] = (crimeCounts[category] || 0) + 1;
        });

        const ctx = document.getElementById("crimeChart").getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: Object.keys(crimeCounts),
                datasets: [{
                    label: "Crime Count",
                    data: Object.values(crimeCounts),
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderColor: "rgb(128, 99, 255)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    generateChart();
});
