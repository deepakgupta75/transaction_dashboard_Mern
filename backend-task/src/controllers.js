const axios = require('axios');
const Transaction = require('./models');

const initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response.data;

    await Transaction.deleteMany({});
    await Transaction.insertMany(data);

    res.status(200).send('Database initialized successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
};




const listTransactions = async (req, res) => {
  try {
    const { page = 1, perPage = 10, search = '' } = req.query;
    const regex = new RegExp(search, 'i');
    const transactions = await Transaction.find({
      $or: [{ title: regex }, { description: regex }, { price: regex }]
    })
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const startDate = new Date(`${month} 1`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const totalSaleAmount = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    const totalSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate }, sold: true });
    const totalNotSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate }, sold: false });

    res.status(200).json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getBarChart = async (req, res) => {
  try {
    const { month } = req.query;
    const startDate = new Date(`${month} 1`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const priceRanges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901-above", min: 901, max: Infinity },
    ];

    const barChart = await Promise.all(priceRanges.map(async (range) => {
      const count = await Transaction.countDocuments({
        dateOfSale: { $gte: startDate, $lt: endDate },
        price: { $gte: range.min, $lt: range.max }
      });
      return { range: range.range, count };
    }));

    res.status(200).json(barChart);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getPieChart = async (req, res) => {
  try {
    const { month } = req.query;
    const startDate = new Date(`${month} 1`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const pieChart = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.status(200).json(pieChart);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getCombinedData = async (req, res) => {
  try {
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      listTransactions(req, res),
      getStatistics(req, res),
      getBarChart(req, res),
      getPieChart(req, res)
    ]);

    res.status(200).json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { initializeDatabase, listTransactions, getStatistics, getBarChart, getPieChart, getCombinedData };
