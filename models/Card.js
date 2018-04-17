var mongoose = require('mongoose');

//sets schema for cards, 2 strings and 2 string arrays
var CardSchema = new mongoose.Schema({
  username: String,
  token: [String],
  cardNo: [String],
  brand: [String]
});

module.exports = mongoose.model('Card', CardSchema);