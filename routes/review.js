const express = require('express');
const router = express.Router({ mergeParams: true });
const catchError = require('../utils/catchError');
const Review = require('../models/review');
const Campground = require('../models/campground');
const { validateReview } = require('../middleware');


router.post('/', validateReview, catchError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = await new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review')
    res.redirect(`/campgrounds/${id}`)
}));

router.delete('/:reviewId', catchError(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { useFindAndModify: false })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted')
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;