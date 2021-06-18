const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to MongoDB');
    }).catch((err) => {
        console.log('MongoDB Error!');
        console.log(err);
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/makeCamp', (req, res) => {
    const campground = new Campground({ title: 'firstCampground', price: 9, description: 'This is the first Campground!' });
    campground.save();
    res.send(campground);
});

app.listen(3000, () => {
    console.log('listening to Port 3000')
});