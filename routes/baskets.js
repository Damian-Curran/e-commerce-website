var express = require('express');
var router = express.Router();

var Basket = require('../models/Basket.js');
var Product = require('../models/Product.js');

router.post('/addToBasket', function(req, res, next) {
    console.log("adding to basket");
    Basket.create(req.body, function (err, post) {
        if (err) return next(err);
        console.log(post);
        res.json(post);
      });
});

router.get('/:id', function(req, res, next) {

    Basket.find({username: req.params.id}, function (err, items) {
        if (err) return next(err);

        for (item in items){
            var array = [];
            var count = 0;
            
            Product.findById(items[item].product, function (err, post) {
                count++;
                if (err) return next(err);
                array.push(post);
                if(count == items.length)
                {
                    res.json(array);
                }
            });
        }
      });
});

router.delete('/:id', function(req, res, next) {
    Basket.remove({username: req.params.id}, function(){
    });
});

module.exports = router;