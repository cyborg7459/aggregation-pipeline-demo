const dotenv = require('dotenv');
dotenv.config({path : './config.env'});

const express = require('express');
const app = express();
const tourController = require('./controllers/tourController');

const mongoose = require('mongoose');
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('Successfully connected to database')
})

app.get('/tours', tourController.getAllTours);
app.get('/tour-data', tourController.getTourData);
app.get('/month-data/:year', tourController.getMonthlyData);

const port = process.env.PORT||3000;
app.listen(port, () => {
    console.log('Server running on port 3000');
})