var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  unique_id:Number,
  name: String,
  description: String,
  cost: Number,
  sold: false,
  image1:String,
	image2:String,
  image3:String,
  seller:String,
  added_date:{
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Product', ProductSchema);