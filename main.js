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

    async function generateBarChart(canvasId) {
        const data = await fetchCrimeData();
        if (!data) return;

        const crimeCounts = {};
        data.forEach((incident) => {
            const category = incident.incident_category || "Unknown";
            crimeCounts[category] = (crimeCounts[category] || 0) + 1;
        });

        const ctx = document.getElementById(canvasId).getContext("2d");
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
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Generate the full page bar chart if canvas exists
    if (document.getElementById("crimeChart")) {
        generateBarChart("crimeChart");
    }

    // Also generate the preview bar chart if the preview canvas exists
    if (document.getElementById("barPreviewChart")) {
        generateBarChart("barPreviewChart");
    }
});
