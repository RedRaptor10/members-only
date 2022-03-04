var express = require('express');
var router = express.Router();

// Controller Modules
var userController = require('../controllers/userController');
var postController = require('../controllers/postController');

// Home Page
router.get('/', postController.index);

// User Controller

// Set Admin
router.get('/set-admin', function(req, res) {
  res.render('setAdmin', { title: 'Become an Admin', user: req.user });
});
router.post('/set-admin', userController.setAdmin);

// Unset Admin
router.get('/unset-admin', function(req, res) {
  res.render('unsetAdmin', { title: 'Revoke Admin', user: req.user });
});
router.post('/unset-admin', userController.unsetAdmin);

// Sign Up Form
router.get('/sign-up', function(req, res) {
  res.render('signUp', { title: 'Sign Up', user: req.user });
});
router.post('/sign-up', userController.signUp);

// Log In Form
router.get('/log-in', function(req, res) {
  res.render('logIn', { title: 'Log in', user: req.user });
});
router.post('/log-in', userController.logIn);

// Log Out
router.get('/log-out', userController.logOut);

// Join
router.get('/join', function(req, res) {
  res.render('join', { title: 'Join', user: req.user });
});
router.post('/join', userController.join);

// Leave
router.get('/leave', function(req, res) {
  res.render('leave', { title: 'Leave', user: req.user });
});
router.post('/leave', userController.leave);

// Post //

// Create
router.get('/create-post', function(req, res) {
  res.render('postCreate', { title: 'Create Post', user: req.user });
});
router.post('/create-post', postController.create);

// Delete
router.get('/post/:id/delete', postController.deleteGET);
router.post('/post/:id/delete', postController.deletePOST);

//router.get('/update-post', function(req, res) {
//  res.render('/post/:id/update', { title: 'Update Post' });
//});



module.exports = router;
