const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

router.get('/', catchError(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCampground, catchError(campgrounds.createCampground));

router.get('/:id', catchError(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchError(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchError(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchError(campgrounds.deleteCampground));

module.exports = router;