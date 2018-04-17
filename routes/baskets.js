//require express
var express = require('express');
var router = express.Router();

//require needed schema models
var Basket = require('../models/Basket.js');
var Product = require('../models/Product.js');

//function to add item to basket
router.post('/addToBasket', function(req, res, next) {
    Basket.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
      });
});

//function to return array of items 
router.get('/:id', function(req, res, next) {
    //find basket which holds current user items
    Basket.find({username: req.params.id}, function (err, items) {
        if (err) return next(err);

        //loop through items in basket
        for (item in items){
            var array = [];
            var count = 0;
            
            //find items in product collection
            Product.findById(items[item].product, function (err, post) {
                count++;
                if (err) return next(err);
                if(post.sold == false)
                {
                    //add item to array
                    array.push(post);
                }
                if(count == items.length)
                {
                    //if no more items
                    //return json array of products
                    res.json(array);
                }
            });
        }
      });
});

//delete basket for user
router.delete('/:id', function(req, res, next) {
    Basket.remove({username: req.params.id}, function(){
    });
});

//delete item from basket
router.delete('/:user/:prodId', function(req, res, next) {
    Basket.remove({username: req.params.user, product: req.params.prodId}, function(){
    });
});

module.exports = router;