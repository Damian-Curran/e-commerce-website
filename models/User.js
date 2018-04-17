var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
    },
	email: {
		type: String
	},
	name: {
		type: String
	},
	area: {
		type: String
	},
	town: {
		type: String
	},
	county: {
		type: String
	},
	token: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

//exports function

//used to store user in user collection
module.exports.createUser = function(newUser, callback){
	//uses bcrypt to encrypt sensitive password information
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			//saves callback which is the newUser object but with password encrypted
	        newUser.save(callback);
	    });
	});
}

//function to update user password
module.exports.updateUser = function(user, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(user.password, salt, function(err, hash) {
	        User.findOneAndUpdate({username: user.username}, {$set: {password: hash}});
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

//used to compare plain text password against encrypted password
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}