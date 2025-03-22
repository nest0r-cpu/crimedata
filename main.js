document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:5000/crime-data")
        .then(response => response.json())
        .then(data => {
            drawChart(data);
        })
        .catch(error => console.error("Error fetching crime data:", error));
});

function drawChart(data) {
    let categories = {};
    data.forEach(crime => {
        let category = crime.incident_category || "Unknown";
        categories[category] = (categories[category] || 0) + 1;
    });

    let labels = Object.keys(categories);
    let values = Object.values(categories);

    let ctx = document.getElementById("crimeChart").getContext("2d");
    
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Crime Count",
                data: values,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1
            }]
        }
    });
}
