const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const passport = require('passport');
const users = require('../controllers/users');

router.get('/register', users.renderRegisterForm);

router.post('/register', catchError(users.registerUser));

router.get('/login', users.renderLoginForm);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);

router.get('/logout', users.logoutUser)

module.exports = router;