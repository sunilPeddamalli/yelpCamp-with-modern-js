const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchError = require('../utils/catchError');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchError(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to YelpCamp! Kindly login');
        res.redirect('/login');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back');
    res.redirect('/campgrounds')
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Logged you out!");
    res.redirect('/campgrounds');
})

module.exports = router;