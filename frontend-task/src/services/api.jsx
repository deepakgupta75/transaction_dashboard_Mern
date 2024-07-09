import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getTransactions = (month, search = '', page = 1, perPage = 10) => {
    return axios.get(`${API_URL}/transactions`, { params: { month, search, page, perPage } });
};

export const getStatistics = (month) => {
    return axios.get(`${API_URL}/statistics`, { params: { month } });
};

export const getBarChart = (month) => {
    return axios.get(`${API_URL}/barchart`, { params: { month } });
};

export const getPieChart = (month) => {
    return axios.get(`${API_URL}/piechart`, { params: { month } });
};
