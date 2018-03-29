var express = require('express');
var router = express.Router();

var Basket = require('../models/Basket.js');

router.post('/addToBasket', function(req, res, next) {
    console.log("adding to basket");
    Basket.create(req.body, function (err, post) {
        if (err) return next(err);
        console.log(post);
        res.json(post);
      });
});

module.exports = router;