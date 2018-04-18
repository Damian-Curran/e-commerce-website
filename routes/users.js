var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer'); // Import Nodemailer Package
var sgTransport = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package
var jwt = require('jsonwebtoken');
var secret = "somethingsecret";

var User = require('../models/User.js');

//sets config for nodemailer
var options = {
	auth: {
		api_user: 'Damian1234', // Sendgrid username
		api_key: 'benson1234567890' // Sendgrid password
	}
}
var client = nodemailer.createTransport(sgTransport(options));

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
		//uses function in model
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

		//check if account has username or email
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
	  
		//if email and username not already existing
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
		
			//create object with form details
			var newUser = new User({
				name: name,
				email:email,
				username: username,
				area: area,
				town: town,
				county: county,
				password: password
			});

			//calls function from model to create user
			User.createUser(newUser, function(err, user){
				if(err) throw err;
			});
		}
		else{
			//if duplicate
			var duplicate = {emailDup, usernameDup};
			res.json(duplicate);
		}
	});
});

//get specific user details
router.get('/get/:user', function(req, res, next) {
    User.find({username: req.params.user},function (err, users) {
	  if (err) return next(err);
      res.json(users);
    });
  });

  //function to update user address
  router.put('/put/:user', function(req, res, next) {
	User.findOneAndUpdate({username:req.params.user}, {$set: {area: req.body.area, town: req.body.town, county: req.body.county}}, function(resp){
	});
  });

  // reset password
router.post('/reset/:username', function(req, res){
	//create token for user using secret key
		var token = jwt.sign({ username: req.params.username}, secret, { expiresIn: '24h' });
		//set update for user in collection
		User.findOneAndUpdate({username: req.params.username}, {$set: {token: token}}, function(resp){
		});

		//find user with matching username
		User.find({username:req.params.username}, function(err, result){
			//if user exists
			if(result != null)
			{
				//create email object
				var email = {
					from: 'Localhost Staff, staff@localhost.com',
					to: result[0].email,
					subject: 'Localhost Reset Password Request',
					text: 'Hello ' + result[0].name + ', You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:3000/#/reset/' + result[0].token,
					html: 'Hello<strong> ' + result[0].name + '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:3000/#/reset/' + result[0].token + '">http://localhost:3000/#/reset/</a>'
				};
				// Function to send e-mail to the user
				client.sendMail(email, function(err, info) {
					if (err) console.log(err); // If error with sending e-mail, log to console/terminal
				});
			}
		})
});

//function used to set new password
router.post('/newPassword/:password/:token', function(req, res){
		User.find({token: req.params.token}, function(err, result){
			if(result != null)
			{
				//call function in user model
				User.updateUser({username: result[0].username, password: req.params.password});
			}
		})
});

module.exports = router;