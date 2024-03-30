const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/trail-trove');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/campgrounds', async (req, res) => {
    const campgrunds = await Campground.find();
    res.render('campgrounds/index');
});

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(3000, () => {
    console.log('Serving on port 3000!');
});