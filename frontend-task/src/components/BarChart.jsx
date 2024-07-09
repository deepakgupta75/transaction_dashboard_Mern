import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getBarChart } from '../services/api';

const BarChart = ({ month }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchBarChart();
    }, [month]);

    const fetchBarChart = async () => {
        const response = await getBarChart(month);
        setData(response.data);
    };

    const chartData = {
        labels: data.map(item => item.range),
        datasets: [
            {
                label: 'Number of Items',
                data: data.map(item => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h3>Transactions Bar Chart</h3>
            <Bar data={chartData} />
        </div>
    );
};

export default BarChart;
