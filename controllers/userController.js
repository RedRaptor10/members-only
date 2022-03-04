const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nconf = require("nconf");

// Sign Up
exports.signUp = [
    // Validate and sanitize fields
    body('username').trim().isLength({ min: 1 }).escape().withMessage('Username required.')
        .isLength({ max: 20 }).withMessage('Username must have 20 characters or less.'),
    body('password', 'Password must contain at least 5 characters.').trim().isLength({ min: 5 }).escape(),
    body('confirmPassword', 'Passwords do not match.').trim().escape().custom((value, { req }) => value === req.body.password),
    body('firstName', 'First Name must have 20 characters or less.').trim().isLength({ max: 20 }).escape(),
    body('lastName', 'Last Name must have 20 characters or less.').trim().isLength({ max: 20 }).escape(),

    // Process Sign Up
    (req, res, next) => {
        // Extract the validation errors from request
        const errors = validationResult(req);

        // Create new User object
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            status: 'Member'
        });

        if (!errors.isEmpty()) {
            // Error, render form again with sanitized values/error messages
            res.render('signUp', { title: 'Sign Up', user: req.user, formData: user, errors: errors.array() });
        } else {
            // Check if username already exists
            User.findOne({'username': user.username})
            .exec(function(err, results) {
                if (err) { return next(err); }
                else if (results) {
                    // Username exists, render form again
                    res.render('signUp', { title: 'Sign Up', user: req.user, formData: user,
                        errors: [{ msg: 'Username already exists.'}] });
                } else {
                    // Form data is valid. Hash password and save user info to database
                    bcrypt.hash(user.password, 10, (err, hashedPassword) => {
                        if (err) { return next(err); }
                        user.password = hashedPassword;

                        // Save user info to database
                        user.save(function(err) {
                            if (err) { return next(err); }
                            // Success. Render sign up page with account created
                            res.render('signUp', { title: 'Sign Up', user: req.user, accountCreated: true });
                        });
                    });
                }
            });
        }
    }
];

// Log In
exports.logIn = [
    // Validate and sanitize fields
    body('username', 'Username required.').trim().isLength({ min: 1 }).escape(),
    body('password', 'Password required.').trim().isLength({ min: 1 }).escape(),

    // Process Log In
    (req, res, next) => {
        // Extract the validation errors from request
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Error, render form again with sanitized values/error messages
            res.render('logIn', { title: 'Log In', user: req.user, formData: { username: req.body.username }, errors: errors.array() });
        } else {
            passport.authenticate('local', function(err, user, info) {
                //successRedirect: '/',
                //failureRedirect: '/log-in'
                if (err) { return next(err); }
                // Incorrect username and/or password. Render form again
                if (!user) { return res.render('logIn', { title: 'Log In', user: req.user, formData: { username: req.body.username },
                    errors: [{ msg: info.message }] }) }

                // Success. Log in & redirect to homepage
                req.login(user, function(err) {
                    if (err) { return next(err); }
                    res.redirect('/');
                });
            })(req, res, next); // passport.authenticate() is a middleware, must invoke function with (req, res, next)
        }
    }
];

// Log Out
exports.logOut = (req, res) => {
    const delay = 5;
    req.logout();
    res.render('logOut', { title: 'Log Out', delay: delay, message: 'You have been successfully logged out. You will be redirected in ' + delay + ' seconds.' });
}

// Join
exports.join = [
    // Validate and sanitize fields
    body('password', 'Password required.').trim().isLength({ min: 1 }).escape(),

    // Process Join
    (req, res, next) => {
        // Extract the validation errors from request
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Error, render form again with sanitized values/error messages
            res.render('join', { title: 'Join', user: req.user, errors: errors.array() });
        } else if (req.body.password != nconf.get('MEMBERS_PASSWORD')) {
            res.render('join', { title: 'Join', user: req.user, errors: [{ msg: 'Incorrect password.' }] });
        } else {
            const delay = 5;
            User.updateOne({"username": req.user.username}, {"$set": {"status": "Avenger"}})
            .exec(function(err) {
                if (err) { return next(err); }
                res.render('join', { title: 'Join', user: req.user, delay: 5,
                    message: 'You have joined the Avengers. You will be redirected in ' + delay + ' seconds.' });
            });
        }
    }
];

// Leave
exports.leave = [
    // Process Leave
    (req, res, next) => {
        const delay = 5;
        User.updateOne({"username": req.user.username}, {"$set": {"status": "Member"}})
        .exec(function(err) {
            if (err) { return next(err); }
            res.render('leave', { title: 'Leave', user: req.user, delay: 5,
                message: 'You have left the Avengers. You will be redirected in ' + delay + ' seconds.' });
        });
    }
];

// Set Admin
exports.setAdmin = [
    // Validate and sanitize fields
    body('password', 'Password required.').trim().isLength({ min: 1 }).escape(),

    // Process Set Admin
    (req, res, next) => {
        // Extract the validation errors from request
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Error, render form again with sanitized values/error messages
            res.render('setAdmin', { title: 'Become an Admin', user: req.user, errors: errors.array() });
        } else if (req.body.password != nconf.get('ADMIN_PASSWORD')) {
            res.render('setAdmin', { title: 'Become an Admin', user: req.user, errors: [{ msg: 'Incorrect password.' }] });
        } else {
            const delay = 5;
            User.updateOne({"username": req.user.username}, {"$set": {"admin": true}})
            .exec(function(err) {
                if (err) { return next(err); }
                res.render('setAdmin', { title: 'Become an Admin', user: req.user, delay: 5,
                    message: 'You are now an admin. You will be redirected in ' + delay + ' seconds.' });
            });
        }
    }
];

// Unset Admin
exports.unsetAdmin = [
    // Process Unset Admin
    (req, res, next) => {
        const delay = 5;
        User.updateOne({"username": req.user.username}, {"$set": {"admin": false}})
        .exec(function(err) {
            if (err) { return next(err); }
            res.render('unsetAdmin', { title: 'Revoke Admin', user: req.user, delay: 5,
                message: 'You are no longer an admin. You will be redirected in ' + delay + ' seconds.' });
        });
    }
];