require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const flightRouter = require('./routes/flight');

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use('/api/flight', flightRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
