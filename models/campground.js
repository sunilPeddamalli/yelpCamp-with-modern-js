const { string } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');

const campgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    images: [{
        url: String,
        filename: String
    }],
    description: String,
    location: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

// mongoose middleware
campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.reviews) {
        await Review.deleteMany({ _id: { $in: campground.reviews } })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);