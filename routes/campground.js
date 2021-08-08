const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

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
    req.flash('success', 'Successfully added campground');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.get('/:id', catchError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    // if (!campground.author._id.equals(req.user._id)) {
    //     req.flash('error', "You don't have premission")
    //     return res.redirect(`/campgrounds/${campground._id}`)
    // }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchError(async (req, res) => {
    const { id } = req.params;
    // const campground = await Campground.findById(id);
    // if (!campground.author._id.equals(req.user._id)) {
    //     req.flash('error', "You don't have premission")
    //     return res.redirect(`/campgrounds/${campground._id}`)
    // }
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { useFindAndModify: false });
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchError(async (req, res) => {
    const { id } = req.params;
    // const campground = await Campground.findById(id);
    // if (!campground.author._id.equals(req.user._id)) {
    //     req.flash('error', "You don't have premission")
    //     return res.redirect(`/campgrounds/${campground._id}`)
    // }
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}));

module.exports = router;