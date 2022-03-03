var express = require('express');
var router = express.Router();

// Controller Modules
var userController = require('../controllers/userController');

/* Home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'The Avengers', user: req.user });
});

/* Sign Up Form */
router.get('/sign-up', function(req, res) {
  res.render('signUp', { title: 'Sign Up', user: req.user });
});
router.post('/sign-up', userController.signUp);

/* Log In Form */
router.get('/log-in', function(req, res) {
  res.render('logIn', { title: 'Log in', user: req.user });
});
router.post('/log-in', userController.logIn);

/* Log Out */
router.get('/log-out', userController.logOut);

/* Join */
router.get('/join', function(req, res) {
  res.render('join', { title: 'Join', user: req.user });
});
router.post('/join', userController.join);

/* Post */
//router.get('/create-post', function(req, res) {
//  res.render('/post/create', { title: 'Create Post' });
//});

//router.get('/update-post', function(req, res) {
//  res.render('/post/:id/update', { title: 'Update Post' });
//});



module.exports = router;
