const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const { campgroundSchema } = require('../schema');
const Campground = require('../models/campground');
const expressError = require('../utils/expressError');
const { isLoggedIn } = require('../middleware');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next()
    }
};

router.get('/', catchError(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchError(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully added campground')
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.get('/:id', catchError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, catchError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, validateCampground, catchError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { useFindAndModify: false });
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, catchError(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}));

module.exports = router;