var mongoose = require('mongoose');

var CardSchema = new mongoose.Schema({
  username: String,
  token: [String],
  cardNo: [String]
});

module.exports = mongoose.model('Card', CardSchema);