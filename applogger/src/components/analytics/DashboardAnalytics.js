import React, { useMemo } from 'react';
import ApplicationsTimeSeriesChart from './ApplicationsTimeSeriesChart';
import StatusDistributionChart from './StatusDistributionChart';
import './Analytics.css'; // We'll create this CSS file

// Helper function to group data by week or month (can be enhanced)
const groupByPeriod = (applications, period = 'week') => {
    const groups = {};
    applications.forEach(app => {
        try {
            const date = new Date(app.timestamp);
            let key;
            if (period === 'day') {
                key = date.toISOString().split('T')[0]; // YYYY-MM-DD
            } else if (period === 'month') {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
            }
             else { // Default to week
                const firstDayOfWeek = new Date(date);
                firstDayOfWeek.setDate(date.getDate() - date.getDay()); // Get Sunday
                key = firstDayOfWeek.toISOString().split('T')[0]; // Week starting Sunday
            }

            if (!groups[key]) {
                groups[key] = { count: 0, points: 0 };
            }
            groups[key].count++;
            groups[key].points += app.pointsEarned;
        } catch (e) {
             console.warn("Could not parse date for grouping:", app.timestamp);
        }

    });
    // Sort keys chronologically
    const sortedKeys = Object.keys(groups).sort();
    const labels = sortedKeys;
    const appCounts = sortedKeys.map(key => groups[key].count);
    const pointsData = sortedKeys.map(key => groups[key].points);
    return { labels, appCounts, pointsData };
};

// Helper function to count statuses
const countStatuses = (applications) => {
    const counts = {};
    applications.forEach(app => {
        const status = app.status || 'Unknown';
        counts[status] = (counts[status] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    return { labels, data };
};

function DashboardAnalytics({ applications }) {
    // useMemo prevents recalculating on every render unless applications change
    const timeSeriesData = useMemo(() => groupByPeriod(applications, 'week'), [applications]);
    const statusData = useMemo(() => countStatuses(applications), [applications]);

    if (!applications || applications.length === 0) {
        return <div className="analytics-container empty">No application data yet to generate analytics.</div>;
    }

    return (
        <div className="analytics-container card">
            <h2>Analytics Dashboard</h2>
            <div className="charts-grid">
                <div className="chart-container">
                    <h3>Applications & Points Over Time (Weekly)</h3>
                    {timeSeriesData.labels.length > 0 ? (
                        <ApplicationsTimeSeriesChart data={timeSeriesData} />
                    ) : (
                        <p>Not enough data for time series chart.</p>
                    )}
                </div>
                <div className="chart-container">
                    <h3>Application Status Distribution</h3>
                    {statusData.labels.length > 0 ? (
                        <StatusDistributionChart data={statusData} />
                    ) : (
                        <p>No status data available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardAnalytics;