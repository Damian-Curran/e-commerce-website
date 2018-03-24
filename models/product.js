var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  name: String,
  description: String
});

module.exports = mongoose.model('Product', ProductSchema);