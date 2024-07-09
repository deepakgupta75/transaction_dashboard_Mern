import React, { useState, useEffect } from 'react';
import { getStatistics } from '../services/api';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        fetchStatistics();
    }, [month]);

    const fetchStatistics = async () => {
        const response = await getStatistics(month);
        setStatistics(response.data);
    };

    return (
        <div>
            <h3>Statistics</h3>
            <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
            <p>Total Sold Items: {statistics.totalSoldItems}</p>
            <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
    );
};

export default Statistics;
