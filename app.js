const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require('passport');
const mongoose = require("mongoose");
const config = require('./config/database');

const authRoutes = require('./routes/auth');

mongoose.connect(config.database, { useNewUrlParser: true });

// On Connection
mongoose.connection.on('connected', function(){
    console.log('Connected to database ' + config.database);
});

// On connection error
mongoose.connection.on('error', function(err){
    console.log('Database error: ' + err);
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-timebase"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/api/v1.0/auth', authRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;