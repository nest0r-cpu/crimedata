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

    async function generatePieChart(canvasId) {
        const data = await fetchCrimeData();
        if (!data) return;

        const crimeCounts = {};
        data.forEach((incident) => {
            const category = incident.incident_category || "Unknown";
            crimeCounts[category] = (crimeCounts[category] || 0) + 1;
        });

        const ctx = document.getElementById(canvasId).getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(crimeCounts),
                datasets: [{
                    data: Object.values(crimeCounts),
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(54, 162, 235, 0.5)",
                        "rgba(255, 206, 86, 0.5)",
                        "rgba(75, 192, 192, 0.5)",
                        "rgba(153, 102, 255, 0.5)",
                        "rgba(255, 159, 64, 0.5)"
                    ],
                    borderColor: [
                        "rgb(255, 99, 132)",
                        "rgb(54, 162, 235)",
                        "rgb(255, 206, 86)",
                        "rgb(75, 192, 192)",
                        "rgb(153, 102, 255)",
                        "rgb(255, 159, 64)"
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Generate the full page pie chart if canvas exists
    if (document.getElementById("crimePieChart")) {
        generatePieChart("crimePieChart");
    }

    // Also generate the preview pie chart if the preview canvas exists
    if (document.getElementById("piePreviewChart")) {
        generatePieChart("piePreviewChart");
    }
});
