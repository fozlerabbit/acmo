// Chart.js configuration for ACMO statistics

document.addEventListener('DOMContentLoaded', function() {
    // Data for district-wise child marriages prevented
    const chartData = {
        labels: [
            'জামালপুর', 'শেরপুর', 'সাতক্ষীরা', 'কুড়িগ্রাম', 'ময়মনসিংহ', 
            'সিলেট', 'বরিশাল', 'রংপুর', 'মৌলভীবাজার', 'নীলফামারী', 
            'খুলনা', 'কক্সবাজার', 'নড়াইল'
        ],
        datasets: [{
            label: 'বন্ধ করা বাল্যবিবাহের সংখ্যা',
            data: [31, 27, 23, 18, 18, 13, 11, 9, 6, 4, 3, 2, 2],
            backgroundColor: [
                '#FF6B35', '#E8505B', '#F7931E', '#FFB627', 
                '#C5D86D', '#2C5530', '#4A7C59', '#6B9B7C',
                '#8BAE8F', '#A5C1A9', '#BFD4C3', '#D9E7DD',
                '#F3FAF7'
            ],
            borderColor: '#fff',
            borderWidth: 2,
            hoverOffset: 10
        }]
    };

    const config = {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'জেলা ভিত্তিক বন্ধ করা বাল্যবিবাহের পরিসংখ্যান',
                    font: {
                        size: 16,
                        family: 'Segoe UI, sans-serif',
                        weight: '600'
                    },
                    color: '#2c5530',
                    padding: 20
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: 'Segoe UI, sans-serif'
                        },
                        color: '#333',
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(44, 85, 48, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#ff6b35',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} টি (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000,
                easing: 'easeOutBounce'
            },
            hover: {
                mode: 'nearest',
                intersect: true
            }
        }
    };

    // Initialize chart
    const ctx = document.getElementById('marriageChart');
    if (ctx) {
        // Set canvas size
        ctx.style.height = '400px';
        
        const marriageChart = new Chart(ctx, config);
        
        // Add click event to show detailed info
        ctx.onclick = function(evt) {
            const points = marriageChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
            
            if (points.length) {
                const firstPoint = points[0];
                const label = marriageChart.data.labels[firstPoint.index];
                const value = marriageChart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
                
                // Show detailed information (could be expanded to show modal)
                console.log(`${label}: ${value} টি বাল্যবিবাহ বন্ধ করা হয়েছে`);
            }
        };
        
        // Animate chart when it comes into view
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    marriageChart.update('active');
                    chartObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        chartObserver.observe(ctx.closest('.chart-section'));
    }
});

// Additional chart for future use (monthly progress, etc.)
function createProgressChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(44, 85, 48, 0.1)'
                    },
                    ticks: {
                        color: '#666'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(44, 85, 48, 0.1)'
                    },
                    ticks: {
                        color: '#666'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#333'
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.4,
                    borderWidth: 3,
                    borderColor: '#2c5530'
                },
                point: {
                    backgroundColor: '#ff6b35',
                    borderColor: '#fff',
                    borderWidth: 2,
                    radius: 6,
                    hoverRadius: 8
                }
            }
        }
    };
    
    return new Chart(ctx, config);
}

// Utility function to update chart data dynamically
function updateChartData(chart, newData) {
    chart.data.datasets[0].data = newData;
    chart.update('active');
}

// Function to create bar chart for comparison
function createBarChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(44, 85, 48, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#666'
                    },
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                bar: {
                    backgroundColor: '#2c5530',
                    borderColor: '#ff6b35',
                    borderWidth: 1,
                    borderRadius: 4
                }
            }
        }
    };
    
    return new Chart(ctx, config);
}