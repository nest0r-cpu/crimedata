// API endpoint for San Francisco crime data
const API_URL = 'https://data.sfgov.org/resource/wg3w-h783.json';

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch crime data
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log('Fetched data count:', data.length);

        // Process the data
        const processedData = processData(data);
        console.log('Processed data:', processedData);

        // Initialize Crime Categories Chart
        const crimeCategoriesCtx = document.getElementById('crimeCategoriesChart');
        if (crimeCategoriesCtx) {
            new Chart(crimeCategoriesCtx.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: Object.keys(processedData.categories),
                    datasets: [{
                        data: Object.values(processedData.categories),
                        backgroundColor: [
                            '#e74c3c', '#2ecc71', '#f1c40f', '#3498db', '#9b59b6',
                            '#1abc9c', '#e67e22', '#34495e', '#7f8c8d', '#16a085',
                            '#d35400', '#8e44ad', '#2c3e50', '#95a5a6', '#27ae60'
                        ],
                        borderColor: '#fff',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 100, // Increased padding to accommodate legend
                            left: 20,
                            right: 20
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            align: 'center',
                            labels: {
                                padding: 20,
                                font: { size: 12 },
                                usePointStyle: true,
                                pointStyle: 'circle',
                                boxWidth: 8,
                                generateLabels: function(chart) {
                                    const data = chart.data;
                                    if (data.labels.length && data.datasets.length) {
                                        return data.labels.map((label, i) => {
                                            const value = data.datasets[0].data[i];
                                            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                            const percentage = ((value / total) * 100).toFixed(1);
                                            return {
                                                text: `${label}: ${value} (${percentage}%)`,
                                                fillStyle: data.datasets[0].backgroundColor[i],
                                                strokeStyle: '#fff',
                                                lineWidth: 1,
                                                pointStyle: 'circle',
                                                hidden: false
                                            };
                                        });
                                    }
                                    return [];
                                }
                            }
                        },
                        title: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Initialize Geographic Distribution Chart
        const geographicCtx = document.getElementById('geographicChart');
        if (geographicCtx) {
            // Filter out "Out of SF" and sort by count
            const districtData = Object.entries(processedData.districts)
                .filter(([district]) => district !== 'Out of SF')
                .sort(([_, a], [__, b]) => b - a);

            new Chart(geographicCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: districtData.map(([district]) => district),
                    datasets: [{
                        label: 'Number of Incidents',
                        data: districtData.map(([_, count]) => count),
                        backgroundColor: '#3498db',
                        borderColor: '#2980b9',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Incidents'
                            }
                        }
                    }
                }
            });
        }

        // Initialize Time Analysis Chart
        const timeAnalysisCtx = document.getElementById('timeAnalysisChart');
        if (timeAnalysisCtx) {
            new Chart(timeAnalysisCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: Object.keys(processedData.timeOfDay),
                    datasets: [{
                        label: 'Incidents by Hour',
                        data: Object.values(processedData.timeOfDay),
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Incidents'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Hour of Day'
                            }
                        }
                    }
                }
            });
        }

        // Initialize Major Crimes Chart
        const majorCrimesCtx = document.getElementById('policeResponseChart');
        if (majorCrimesCtx) {
            new Chart(majorCrimesCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: Object.keys(processedData.majorCrimes),
                    datasets: [{
                        label: 'Major Crime Categories',
                        data: Object.values(processedData.majorCrimes).map(item => item.count),
                        backgroundColor: [
                            '#e74c3c',  // Theft - Red
                            '#2ecc71',  // Drug Related - Green
                            '#f1c40f',  // Assault - Yellow
                            '#3498db',  // Non-Violent - Blue
                            '#e67e22',  // Vehicle Related - Orange
                            '#9b59b6'   // Other - Purple
                        ],
                        borderColor: [
                            '#c0392b',  // Darker Red
                            '#27ae60',  // Darker Green
                            '#f39c12',  // Darker Yellow
                            '#2980b9',  // Darker Blue
                            '#d35400',  // Darker Orange
                            '#8e44ad'   // Darker Purple
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: false
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const percentage = processedData.majorCrimes[label].percentage;
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Incidents'
                            }
                        }
                    }
                }
            });
        }

    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
});

// Process the crime data
function processData(data) {
    const categories = {
        'Larceny Theft': 0,
        'Burglary': 0,
        'Assault': 0,
        'Battery': 0,
        'Drug Related': 0,
        'Vehicle Theft': 0,
        'Vehicle Vandalism': 0,
        'Fraud': 0,
        'Forgery': 0,
        'Vandalism': 0,
        'Trespass': 0,
        'Prostitution': 0,
        'Weapons': 0,
        'Robbery': 0,
        'Arson': 0,
        'Embezzlement': 0,
        'Kidnapping': 0,
        'Sex Offense': 0,
        'Disorderly Conduct': 0,
        'Recovered Vehicle': 0,
        'Lost Property': 0,
        'Suspicious Activity': 0,
        'Traffic Violation': 0,
        'Warrant': 0,
        'Other Crimes': 0
    };
    const districts = {};
    const timeOfDay = {};
    const majorCrimes = {
        'Theft': 0,
        'Drug Related': 0,
        'Assault': 0,
        'Non-Violent': 0,
        'Vehicle Related': 0,
        'Other': 0
    };

    // Initialize time of day object with all 24 hours
    for (let i = 0; i < 24; i++) {
        timeOfDay[i] = 0;
    }

    let totalIncidents = 0;

    data.forEach(incident => {
        // Process categories - more detailed categorization
        const category = (incident.incident_category || 'Unknown').toLowerCase();
        if (category.includes('larceny') || category.includes('theft')) {
            categories['Larceny Theft']++;
        } else if (category.includes('burglary')) {
            categories['Burglary']++;
        } else if (category.includes('assault')) {
            categories['Assault']++;
        } else if (category.includes('battery')) {
            categories['Battery']++;
        } else if (category.includes('drug') || category.includes('narcotic')) {
            categories['Drug Related']++;
        } else if (category.includes('vehicle theft') || category.includes('auto theft')) {
            categories['Vehicle Theft']++;
        } else if (category.includes('vehicle vandalism') || category.includes('auto vandalism')) {
            categories['Vehicle Vandalism']++;
        } else if (category.includes('fraud')) {
            categories['Fraud']++;
        } else if (category.includes('forgery')) {
            categories['Forgery']++;
        } else if (category.includes('vandalism') || category.includes('malicious mischief')) {
            categories['Vandalism']++;
        } else if (category.includes('trespass')) {
            categories['Trespass']++;
        } else if (category.includes('prostitution')) {
            categories['Prostitution']++;
        } else if (category.includes('weapon') || category.includes('firearm')) {
            categories['Weapons']++;
        } else if (category.includes('robbery')) {
            categories['Robbery']++;
        } else if (category.includes('arson')) {
            categories['Arson']++;
        } else if (category.includes('embezzlement')) {
            categories['Embezzlement']++;
        } else if (category.includes('kidnapping')) {
            categories['Kidnapping']++;
        } else if (category.includes('sex offense') || category.includes('rape')) {
            categories['Sex Offense']++;
        } else if (category.includes('disorderly conduct') || category.includes('disturbing the peace')) {
            categories['Disorderly Conduct']++;
        } else if (category.includes('recovered vehicle')) {
            categories['Recovered Vehicle']++;
        } else if (category.includes('lost property')) {
            categories['Lost Property']++;
        } else if (category.includes('suspicious') || category.includes('suspicious activity')) {
            categories['Suspicious Activity']++;
        } else if (category.includes('traffic') || category.includes('driving') || category.includes('dui')) {
            categories['Traffic Violation']++;
        } else if (category.includes('warrant')) {
            categories['Warrant']++;
        } else {
            categories['Other Crimes']++;
        }

        // Process districts - using police_district instead of pd_district
        const district = incident.police_district || 'Unknown';
        districts[district] = (districts[district] || 0) + 1;

        // Process time of day
        if (incident.incident_time) {
            const hour = parseInt(incident.incident_time.split(':')[0]);
            if (!isNaN(hour) && hour >= 0 && hour < 24) {
                timeOfDay[hour]++;
            }
        }

        // Process major crime categories
        if (category.includes('theft') || category.includes('larceny') || category.includes('burglary')) {
            majorCrimes['Theft']++;
        } else if (category.includes('drug') || category.includes('narcotic')) {
            majorCrimes['Drug Related']++;
        } else if (category.includes('assault') || category.includes('battery') || category.includes('homicide')) {
            majorCrimes['Assault']++;
        } else if (category.includes('fraud') || category.includes('vandalism') || category.includes('trespass') || 
                   category.includes('lost property')) {
            majorCrimes['Non-Violent']++;
        } else if (category.includes('vehicle') || category.includes('auto') || category.includes('car') || 
                   category.includes('motorcycle') || category.includes('bicycle')) {
            majorCrimes['Vehicle Related']++;
        } else {
            majorCrimes['Other']++;
        }
        totalIncidents++;
    });

    // Filter out categories with zero incidents
    const filteredCategories = Object.fromEntries(
        Object.entries(categories).filter(([_, count]) => count > 0)
    );

    // Convert time of day labels to 12-hour format
    const formattedTimeOfDay = {};
    Object.keys(timeOfDay).forEach(hour => {
        const hourNum = parseInt(hour);
        const period = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12;
        formattedTimeOfDay[`${hour12} ${period}`] = timeOfDay[hour];
    });

    // Calculate percentages for major crimes
    const majorCrimesWithPercentages = {};
    Object.entries(majorCrimes).forEach(([category, count]) => {
        const percentage = totalIncidents > 0 ? ((count / totalIncidents) * 100).toFixed(1) : '0.0';
        majorCrimesWithPercentages[category] = {
            count: count,
            percentage: percentage
        };
    });

    return {
        categories: filteredCategories,
        districts,
        timeOfDay: formattedTimeOfDay,
        majorCrimes: majorCrimesWithPercentages
    };
}

// Modal functionality
let chartInstances = {};

function openModal(chartId) {
    const modal = document.getElementById('chartModal');
    const modalChart = document.getElementById('modalChart');
    const originalChart = document.getElementById(chartId);
    
    // Get the original chart's data and options
    const originalChartInstance = Chart.getChart(chartId);
    if (!originalChartInstance) return;

    // Destroy existing modal chart if it exists
    if (chartInstances[modalChart.id]) {
        chartInstances[modalChart.id].destroy();
    }

    // Create new chart in modal with the same data and options
    const modalChartInstance = new Chart(modalChart.getContext('2d'), {
        type: originalChartInstance.config.type,
        data: originalChartInstance.config.data,
        options: {
            ...originalChartInstance.config.options,
            maintainAspectRatio: false,
            responsive: true
        }
    });

    // Store the modal chart instance
    chartInstances[modalChart.id] = modalChartInstance;

    // Show the modal
    modal.style.display = 'block';
}

// Close modal when clicking the close button
document.querySelector('.close-modal').addEventListener('click', () => {
    const modal = document.getElementById('chartModal');
    modal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('chartModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const modal = document.getElementById('chartModal');
        modal.style.display = 'none';
    }
}); 