// DOM Elements
const crimeTypeFilter = document.getElementById('crimeTypeFilter');
const timeRangeFilter = document.getElementById('timeRangeFilter');
const districtCrimeChart = document.getElementById('districtCrimeChart');

let chart = null;

// Initialize the chart
async function initializeChart() {
    try {
        await loadAndRenderData();
        
        // Add event listeners
        crimeTypeFilter.addEventListener('change', loadAndRenderData);
        timeRangeFilter.addEventListener('change', loadAndRenderData);
    } catch (error) {
        console.error('Error initializing chart:', error);
    }
}

// Load and render data
async function loadAndRenderData() {
    const selectedCategory = crimeTypeFilter.value;
    const days = timeRangeFilter.value;

    try {
        // Calculate the date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Format dates for the API
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        // Fetch crime data from the API
        const response = await fetch(
            `https://data.sfgov.org/resource/wg3w-h783.json?$where=date_of_occurrence between '${startDateStr}' and '${endDateStr}'`
        );
        const crimeData = await response.json();

        // Populate crime type filter options if not already populated
        if (crimeTypeFilter.options.length <= 1) {
            const categories = [...new Set(crimeData.map(crime => crime.category))];
            categories.sort();
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                crimeTypeFilter.appendChild(option);
            });
        }

        // Process data for the chart
        const districtData = processDistrictData(crimeData, selectedCategory);
        renderChart(districtData);
    } catch (error) {
        console.error('Error fetching crime data:', error);
    }
}

// Process data for the chart
function processDistrictData(crimeData, selectedCategory) {
    // Filter by category if selected
    let filteredData = selectedCategory 
        ? crimeData.filter(crime => crime.category === selectedCategory)
        : crimeData;

    // Group by district and count crimes
    const districtCounts = filteredData.reduce((acc, crime) => {
        const district = crime.police_district || 'Unknown';
        acc[district] = (acc[district] || 0) + 1;
        return acc;
    }, {});

    // Convert to arrays for the chart
    return {
        labels: Object.keys(districtCounts),
        data: Object.values(districtCounts)
    };
}

// Render the chart
function renderChart(chartData) {
    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }

    // Create new chart
    chart = new Chart(districtCrimeChart, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Number of Crimes',
                data: chartData.data,
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Crimes'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Police District'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Crime Distribution by District'
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeChart); 