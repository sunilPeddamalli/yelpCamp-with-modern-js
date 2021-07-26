const express = require('express');
const router = express.Router({ mergeParams: true });
const catchError = require('../utils/catchError');
const { reviewSchema } = require('../schema');
const Review = require('../models/review');
const Campground = require('../models/campground');
const expressError = require('../utils/expressError');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next()
    }
};

router.post('/', validateReview, catchError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = await new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`)
}));

router.delete('/:reviewId', catchError(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { useFindAndModify: false })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;