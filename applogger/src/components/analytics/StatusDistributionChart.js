import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register components
ChartJS.register(ArcElement, Tooltip, Legend);

// Helper function for consistent colors based on status
const getStatusColor = (status) => {
    const lowerStatus = status.toLowerCase().replace(/\s+/g, '-');
    switch (lowerStatus) {
        case 'applied': return '#007bff';       // Blue
        case 'screening': return '#17a2b8';     // Teal
        case 'interviewing': return '#ffc107';  // Yellow
        case 'offer': return '#28a745';         // Green
        case 'rejected': return '#dc3545';      // Red
        case 'withdrawn': return '#6c757d';     // Grey
        default: return '#adb5bd';              // Light Grey
    }
};

function StatusDistributionChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: '# of Applications',
        data: data.data,
        backgroundColor: data.labels.map(label => getStatusColor(label)),
        // borderColor: data.labels.map(label => getStatusColor(label)), // Optional border
         borderWidth: 1,
      },
    ],
  };

  const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
            position: 'right', // Position legend nicely for doughnut
             labels: {
                 boxWidth: 15 // Smaller color boxes in legend
             }
        },
        title: { display: false },
        tooltip: {
            callbacks: { // Show percentage in tooltip
                label: function(context) {
                    let label = context.label || '';
                    if (label) { label += ': '; }
                    if (context.parsed !== null) {
                         const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                         const percentage = ((context.parsed / total) * 100).toFixed(1) + '%';
                         label += `${context.raw} (${percentage})`;
                    }
                    return label;
                }
            }
        }
      },
    };

  // Give the chart container a specific height for aspect ratio control
  return <div style={{ height: '300px', position: 'relative' }}> <Doughnut data={chartData} options={options}/> </div>;
}

export default StatusDistributionChart;