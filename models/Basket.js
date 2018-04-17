var mongoose = require('mongoose');

//sets scheme for baskets
var BasketSchema = new mongoose.Schema({
  username: String,
  product: String
});

//exports mongoose model
module.exports = mongoose.model('Basket', BasketSchema);