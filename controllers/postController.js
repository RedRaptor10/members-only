const Post = require('../models/post');
const { body, validationResult } = require('express-validator');

// Home Page, display list of all posts
exports.index = function(req, res, next) {
    // Find all posts
    Post.find({})
    .sort({date: -1}) // Sort by date in descending order
    .populate('author')
    .exec(function(err, posts) {
        if (err) { return next(err); }
        res.render('index', { title: 'The Avengers', user: req.user, posts: posts });
    });
};

// Create
exports.create = [
    // Validate and sanitize fields
    body('title').trim().isLength({ min: 1 }).escape().withMessage('Title required.')
        .isLength({ max: 100 }).withMessage('Title must have 20 characters or less.'),
    body('message', 'Message required.').trim().isLength({ min: 1 }).escape(),

    // Process Create
    (req, res, next) => {
        // Extract the validation errors from request
        const errors = validationResult(req);

        // Create new Post object
        const post = new Post({
            title: req.body.title,
            author: req.user._id,
            date: new Date(),
            message: req.body.message
        });

        if (!errors.isEmpty()) {
            // Error, render form again with sanitized values/error messages
            res.render('postCreate', { title: 'Create Post', user: req.user, formData: post, errors: errors.array() });
        } else {
            // Save post to database
            post.save(function(err) {
                if (err) { return next(err); }

                // // Success. Find all posts and render home page
                Post.find({})
                .sort({date: -1}) // Sort by date in descending order
                .populate('author')
                .exec(function(err, posts) {
                    if (err) { return next(err); }
                    res.render('index', { title: 'The Avengers', user: req.user, posts: posts });
                });
            });
        }
    }
];

// Delete GET
exports.deleteGET = function(req, res, next) {
    if (!req.user.admin || req.user.admin == false) {
        res.render('postDelete', { title: 'Delete Post', user: req.user, message: 'You are not an admin.' });
    } else {
        Post.findOne({_id: req.params.id})
        .populate('author')
        .exec(function(err, result) {
            if (err) { return next(err); }
            res.render('postDelete', { title: 'Delete Post', user: req.user, post: result });
        });
    }
};

// Delete POST
exports.deletePOST = [
    (req, res, next) => {
        const delay = 5;
        Post.deleteOne({_id: req.params.id})
        .exec(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    }
];