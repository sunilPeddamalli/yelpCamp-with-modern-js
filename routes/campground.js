const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(catchError(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchError(campgrounds.createCampground))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body);
//     console.log(req.files);
// })

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchError(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchError(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchError(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchError(campgrounds.renderEditForm));

module.exports = router;