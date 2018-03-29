var mongoose = require('mongoose');

var BasketSchema = new mongoose.Schema({
  username: String,
  product: String
});

module.exports = mongoose.model('Basket', BasketSchema);