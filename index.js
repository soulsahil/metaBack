require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importing routers
// Importing routers
const AuthRouter = require('./routes/AuthRouter');
const ProductRouter = require('./routes/ProductRouter');
const AccountRouter = require('./Routes/AccountRouter');
const InfoRouter = require('./Routes/InfoRouter')

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGO_CONN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.get('/ping', (req, res) => {
  res.send('PONG');
});

// Router mounting
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/accounts', AccountRouter);
app.use('/api/info', InfoRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

// Export for Vercel
module.exports = app;