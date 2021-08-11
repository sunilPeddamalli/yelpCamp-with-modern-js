const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully added campground');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.showCampground = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
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
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    // const campground = await Campground.findById(id);
    // if (!campground.author._id.equals(req.user._id)) {
    //     req.flash('error', "You don't have premission")
    //     return res.redirect(`/campgrounds/${campground._id}`)
    // }
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { useFindAndModify: false });
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    // const campground = await Campground.findById(id);
    // if (!campground.author._id.equals(req.user._id)) {
    //     req.flash('error', "You don't have premission")
    //     return res.redirect(`/campgrounds/${campground._id}`)
    // }
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
};