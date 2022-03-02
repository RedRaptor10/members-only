var express = require('express');
var router = express.Router();

// Controller Modules
var userController = require('../controllers/userController');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Avengers', user: req.user });
});

/* Sign Up Form GET */
router.get('/sign-up', function(req, res) {
  res.render('signUp', { title: 'Sign Up' });
});

/* Sign Up Form POST */
router.post('/sign-up', userController.signUp);

/* Log In Form GET */
router.get('/log-in', function(req, res) {
  res.render('logIn', { title: 'Log in' });
});

/* Log In Form POST */
router.post('/log-in', userController.logIn);

/* Log Out GET */
router.get('/log-out', userController.logOut);

/* Post */
//router.get('/create-post', function(req, res) {
//  res.render('/post/create', { title: 'Create Post' });
//});

//router.get('/update-post', function(req, res) {
//  res.render('/post/:id/update', { title: 'Update Post' });
//});



module.exports = router;
