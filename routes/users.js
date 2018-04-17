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
	User.find({email: req.params.email}, function (err, post) {
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
	User.find({$or: [{username: req.body.username}, {email: req.body.email}]},function (err, users) {
		var usernameDup = false;
		var emailDup = false;

		for(i = 0; i < users.length; i++)
		{
			if(users[i].username == req.body.username)
			{
				usernameDup = true;
			}
			if(users[i].email == req.body.email)
			{
				emailDup = true;
			}
		}
	  
		if(usernameDup == false && emailDup == false)
		{
			var name = req.body.name;
			var email = req.body.email;
			var username = req.body.username;
			var area = req.body.area;
			var town = req.body.town;
			var county = req.body.county;
			var password = req.body.password;
			var password2 = req.body.password2;
		
			var newUser = new User({
				name: name,
				email:email,
				username: username,
				area: area,
				town: town,
				county: county,
				password: password
			});

			User.createUser(newUser, function(err, user){
				if(err) throw err;
			});
		}
		else{
			var duplicate = {emailDup, usernameDup};
			res.json(duplicate);
		}
	});
});

router.get('/get/:user', function(req, res, next) {
    User.find({username: req.params.user},function (err, users) {
	  if (err) return next(err);
      res.json(users);
    });
  });

  router.put('/put/:user', function(req, res, next) {
	User.findOneAndUpdate({username:req.params.user}, {$set: {area: req.body.area, town: req.body.town, county: req.body.county}}, function(resp){
	});
  });

  // reset password
router.post('/reset/:username', function(req, res){
	User.createToken(req.params.username, function(err){
		
	});
});

module.exports = router;