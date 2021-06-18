const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Cities = require('./cities');
const { descriptors, places } = require('./seedHelpers')

mongoose.connect('mongodb://localhost/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to MongoDB');
    }).catch((err) => {
        console.log('MongoDB Error!');
        console.log(err);
    });

const sample = arr => arr[Math.trunc(Math.random() * arr.length)];

const seed = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i <= 50; i++) {
        const random = Math.trunc(Math.random() * 1000);
        const campground = new Campground({
            location: `${Cities[random].city},${Cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });
        await campground.save();
    }
}

seed().then(() => {
    mongoose.connection.close();
})

