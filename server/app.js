const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const authRoutes = require('./routes/authroutes');
const transactionRoutes = require('./routes/transactions');

const app = express();


const PORT = 3001;

const mongoURL = "mongodb+srv://saikrishnachippa4:saikrishna@financialapp.c07frso.mongodb.net/financial?retryWrites=true&w=majority&appName=financialapp";

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error.message));

app.use(bodyParser.json());


app.use(cors());

app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
