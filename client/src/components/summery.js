import React, { useState, useEffect } from 'react';
import api from '../api';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import styles from './summery.module.css';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement);

const SummaryView = ({ token }) => {
    const [timePeriod, setTimePeriod] = useState('monthly');
    const [summaryData, setSummaryData] = useState(0);
    const [categoryData, setCategoryData] = useState([]);
    const [spendingOverTime, setSpendingOverTime] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState('');

    useEffect(() => {
        const fetchSummaryData = async () => {
            try {
                let response;

                if (startDate && endDate) {
                    response = await api.get(`/transactions/summary/${startDate}/${endDate}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } else {
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear();
                    const currentMonth = currentDate.getMonth() + 1;
                    const currentWeek = getWeekNumber(currentDate);

                    if (timePeriod === 'daily') {
                        response = await api.get(`/transactions/summary/${currentYear}/${currentMonth}/${currentDate.getDate()}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                    } else if (timePeriod === 'weekly') {
                        response = await api.get(`/transactions/summary/${currentYear}/${currentMonth}/week/${currentWeek}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                    } else if (timePeriod === 'monthly') {
                        response = await api.get(`/transactions/summery/${currentYear}/${currentMonth}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                    }
                }

                setSummaryData(response.data.totalSpending || 0);
                setData(response.data);
                console.log(response.data)
                setCategoryData(response.data.spendingByCategory || []);
                console.log(response)
                setSpendingOverTime(response.data.spendingOverTime || []);
            } catch (error) {
                console.error('Error fetching summary data:', error.message);
            }
        };

        fetchSummaryData();
    }, [timePeriod, token, startDate, endDate]);

    const getWeekNumber = (date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    const getPieChartData = () => {
        return {
            labels: categoryData.map(category => category.categoryName),
            datasets: [{
                data: categoryData.map(category => category.amount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            }],
        };
    };

    const getLineChartData = () => {
        return {
            labels: spendingOverTime.map(entry => entry.date),
            datasets: [{
                label: 'Spending Over Time',
                data: spendingOverTime.map(entry => entry.amount),
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            }],
        };
    };

    return (
        <div className={styles.summaryViewContainer}>
            <h3>Spending Summary</h3>
            <div>
                <label>Time Period:</label>
                <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>
            {/* Uncomment if you need custom date range selection */}
            {/* {timePeriod === 'custom' && (
                <div className={styles.dateRangePicker}>
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <label>End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            )} */}
            <div className={styles.summaryData}>
                <h4>Total Spending: ${summaryData}</h4>
            </div>
            <div className={styles.categoryData}>
                <h4>Spending by Category</h4>
                <Pie data={getPieChartData()} />
            </div>
            {/* <div className={styles.spendingOverTime}>
                <h4>Spending Over Time</h4>
                <Line data={getLineChartData()} />
            </div> */}
        </div>
    );
};

export default SummaryView;
