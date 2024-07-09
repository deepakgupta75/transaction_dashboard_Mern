import React, { useState } from 'react';
import MonthSelector from './components/MonthSelector';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const App = () => {
    const [selectedMonth, setSelectedMonth] = useState('March');

    return (
        <div className="App">
            <h1>Transaction Dashboard</h1>
            <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />
            <Statistics month={selectedMonth} />
            <TransactionsTable month={selectedMonth} />
            <BarChart month={selectedMonth} />
        </div>
    );
};

export default App;
