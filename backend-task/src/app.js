const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(  // This line of code is used to connect the frontend to the backend
  cors({  // and it takes 3 parameters: origin, methods, credentials
      origin: ["http://localhost:5173"],  // Corrected URL string format
      methods: ["GET", "PUT", "DELETE", "POST"],  // Fixed method names
      credentials: true,  // Corrected spelling
  })
);

// mongoose.connect('mongodb://localhost:27017/transactions', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect('mongodb+srv://deepakgupta75066:deepak123@transtiondashboard.p34dmxp.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });



// Example route to handle POST requests for creating transactions
app.post('/api/transactions', (req, res) => {
  const { price } = req.body;

  if (typeof price !== 'number') {
      return res.status(400).json({ error: 'Price must be a number' });
  }

  const newTransaction = new Transaction({ price });
  newTransaction.save()
      .then(transaction => res.json(transaction))
      .catch(err => res.status(500).json({ error: err.message }));
});


app.use(express.json());
app.use('/api', routes);
// Import your routes
// const transactions = require('./routes/transactions');

app.get("/", (req,res)=> {
    res.json({message:"server is watching",});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
