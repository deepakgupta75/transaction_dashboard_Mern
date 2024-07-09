const mongoose = require('mongoose');
const router = require('./routes');

const transactionSchema = new mongoose.Schema({
  productId: Number,
  title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  category: String,
  sold: Boolean
});

const Transaction = mongoose.model('Transaction', transactionSchema);







module.exports = Transaction;
