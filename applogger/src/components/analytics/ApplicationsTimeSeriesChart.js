import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ApplicationsTimeSeriesChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Applications Submitted',
        data: data.appCounts,
        borderColor: 'rgb(54, 162, 235)', // Blue
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        yAxisID: 'yApps', // Assign to the left y-axis
        tension: 0.1
      },
      {
        label: 'Points Earned',
        data: data.pointsData,
        borderColor: 'rgb(75, 192, 192)', // Green/Teal
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
         yAxisID: 'yPoints', // Assign to the right y-axis
        tension: 0.1
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to fill container height
    scales: {
      x: {
         title: { display: true, text: 'Week Starting' },
      },
      yApps: { // Left Y-axis for Applications
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Applications Count',
        },
        grid: { // Only draw grid lines for the left axis
            drawOnChartArea: true,
        }
      },
       yPoints: { // Right Y-axis for Points
        type: 'linear',
        display: true,
        position: 'right',
         beginAtZero: true,
        title: {
          display: true,
          text: 'Points Earned',
        },
        grid: { // Do not draw grid lines for the right axis
          drawOnChartArea: false,
        },
      },
    },
     plugins: {
        legend: { position: 'top' },
        title: { display: false }, // Already have h3 title
        tooltip: { mode: 'index', intersect: false }
     }
  };

  return <div style={{ height: '300px' }}> <Line options={options} data={chartData} /></div>;
}

export default ApplicationsTimeSeriesChart;