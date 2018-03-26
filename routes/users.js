var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/User.js');

/* GET /users listing. */
router.get('/', function(req, res, next) {
    User.find(function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
  });

/* GET /users/email */
router.get('/:email', function(req, res, next) {
	});
	
	/* PUT /users/:id */
router.put('/:email', function(req, res, next) {
	User.find(req.params.email, function (err, post) {
		if (err) return next(err);

		User.comparePassword(req.body.password, post[0].password, function(err, isMatch){
			if(err) throw err;
			if(isMatch){
				console.log("match");

				res.json(post[0]);
			} else {
				console.log("invalid");
			}
		})
		//res.json(post);
	});
});

// Register User
router.post('/', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});
	}
);


module.exports = router;