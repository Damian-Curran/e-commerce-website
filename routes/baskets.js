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

router.get('/:id', function(req, res, next) {
    console.log("username = " + req.params.id);

    Basket.find({username: req.params.id}, function (err, items) {
        console.log("username = " + req.params.id);
        console.log("items = " + items);
        if (err) return next(err);

        res.json(items);
      });
});

module.exports = router;