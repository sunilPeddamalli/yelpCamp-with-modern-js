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
        const price = Math.trunc(Math.random() * 20) + 10;
        const campground = new Campground({
            author: '61088bc92f59c11264ddb99f',
            location: `${Cities[random].city}, ${Cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            image: 'https://source.unsplash.com/collection/190727/1600x900',
            description: 'This is the description of the above campground'
        });
        await campground.save();
    }
}

seed().then(() => {
    mongoose.connection.close();
})

