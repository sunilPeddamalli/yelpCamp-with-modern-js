const { string } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');

const ImagesSchema = new mongoose.Schema({
    url: String,
    filename: String
})

ImagesSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_150')
});

ImagesSchema.virtual('showUrl').get(function () {
    return this.url.replace('/upload', '/upload/w_300,h_200')
});

const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImagesSchema],
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
},opts)

campgroundSchema.virtual('properties.popup').get(function () {
    return `<strong><a href=/campgrounds/${this._id}>${this.title}</a></strong>`
});

// mongoose middleware
campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.reviews) {
        await Review.deleteMany({ _id: { $in: campground.reviews } })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);