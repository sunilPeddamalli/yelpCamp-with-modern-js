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
            geometry: { type: 'Point', coordinates: [ 72.82, 18.91 ] },
            description: 'This is the description of the above campground',
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
                    filename: 'YelpCamp/xijxv6ofwowaynpzymug'
                },
                {
                    url: 'https://images.unsplash.com/photo-1528892677828-8862216f3665?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2FtcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
                    filename: 'YelpCamp/yeiukidpnw3f62mf7tde'
                },
                {
                    url: 'https://images.unsplash.com/photo-1599758376048-8c340c1489cb?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNhbXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
                    filename: 'YelpCamp/cflmomxtv9nal11kz2ok'
                }
            ]

        });
        await campground.save();
    }
}

seed().then(() => {
    mongoose.connection.close();
})

