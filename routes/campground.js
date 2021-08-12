const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(catchError(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchError(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchError(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchError(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchError(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchError(campgrounds.renderEditForm));

module.exports = router;