const dotenv = require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const productRouter = require('./routes/productRouter');

const sequelize = require('./util/database');
const product = require('./models/product'); // Import to execute

const app = express();

const port = process.env.PORT;

// Cors options
var corsOptions = {
    origin: `http://localhost:${process.env.APP_PORT}`,
    methods: 'GET, POST, PUT, PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
};

// Cors options middleware
app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// Test route
app.get('/', (req, res, next) => {
    res.json({message: "Welcome to the API"});
});

// Routes
app.use('/product', productRouter);

sequelize
.sync()
.then(result => {
    app.listen(port, () => {
        console.log(`API server running on port: ${port}`);
    });
})
.catch(err => {
    console.log(err);
});