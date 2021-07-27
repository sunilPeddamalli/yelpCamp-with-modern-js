const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressError = require('./utils/expressError');
const campgroundRoute = require('./routes/campground');
const reviewRoute = require('./routes/review');
const session = require('express-session');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to MongoDB');
    }).catch((err) => {
        console.log('MongoDB Error!');
        console.log(err);
    });

const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')))
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    next();
});

// Campground Routes
app.use('/campgrounds', campgroundRoute);

// Review Routes
app.use('/campgrounds/:id/reviews', reviewRoute);

// Home Route
app.get('/', (req, res) => {
    res.redirect('/campgrounds');
});

// all other route
app.all('*', (req, res, next) => {
    throw new expressError('Page not found!', 404);
});

// Error Middleware
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(status).render('error', { err });
});

app.listen(3000, () => {
    console.log('listening to Port 3000')
});