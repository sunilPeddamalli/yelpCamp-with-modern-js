const express = require('express');
const router = express.Router({ mergeParams: true });
const catchError = require('../utils/catchError');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, catchError(reviews.createReview));

// for isReviewAuthor middleware as once user logins the login post method redirects to a get route- Server Side when you remove validaton from show page to show the delete button to all
router.get('/:reviewId', isLoggedIn, isReviewAuthor, catchError(reviews.redirectShowPage));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchError(reviews.deleteReview));

module.exports = router;