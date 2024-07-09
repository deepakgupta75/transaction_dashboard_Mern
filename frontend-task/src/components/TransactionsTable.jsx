import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';

const TransactionsTable = ({ month }) => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);


    useEffect(() => {
        const fetchData = async () => {
            await fetchTransactions();
        };
        fetchData();
    }, [month, search, page]);
    

    const fetchTransactions = async () => {
        try {
            const response = await getTransactions(month, search, page, perPage);
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            // Handle the error gracefully, such as displaying an error message or logging
            throw error;
        }
    };
    
    return (
        <div>
            <input
                type="text"
                placeholder="Search transactions"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date of Sale</th>
                        <th>Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                            <td>{transaction.sold ? "Yes" : "No"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
    );
};

export default TransactionsTable;
