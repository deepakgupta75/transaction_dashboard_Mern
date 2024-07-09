const express = require('express');
const { initializeDatabase, listTransactions, getStatistics, getBarChart, getPieChart, getCombinedData } = require('./controllers');

const router = express.Router();

router.get('/initialize', initializeDatabase);
router.get('/transactions', listTransactions);
// API to list all transactions with search and pagination
router.get('/api/transactions', async (req, res) => {
    try {
        const { month, search, page = 1, perPage = 10 } = req.query;
        const regex = new RegExp(search, 'i');
        const transactions = await Transaction.find({
            dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') },
            $or: [
                { title: regex },
                { description: regex },
                { price: regex },
            ],
        })
        .skip((page - 1) * perPage)
        .limit(Number(perPage));
        res.status(200).json(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Initialize database with seed data from third-party API
  router.get('/api/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.insertMany(response.data);
        res.status(200).send('Database initialized');
    } catch (error) {
        res.status(500).send('Error initializing database');
    }
  });
router.get('/statistics', getStatistics);
router.get('/barchart', getBarChart);
router.get('/piechart', getPieChart);
router.get('/combined', getCombinedData);

module.exports = router;
