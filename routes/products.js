var express = require('express');
var router = express.Router();

var Product = require('../models/Product.js');

/* count /products listing. */
router.get('/count', function(req, res, next) {
  Product.count({sold: false},function(err, counted){
    var count = {count: counted};
    res.json(count);
  });
});

/* GET /products listing. */
router.get('/:size/:page', function(req, res, next) {
  Product.find({sold: false}, function (err, products) {
    if (err) return next(err);
    res.json(products);
  }).limit(parseInt(req.params.size)).skip((parseInt(req.params.page))*req.params.size);
});

/* GET /products listing with category. */
router.get('/:size/:page/:category/:min/:max', function(req, res, next) {
  var query = {sold: false, category: req.params.category};
  if(req.params.min >= 0 && req.params.max > 0)
  {
    query.cost = {$lt: req.params.max, $gt: req.params.min};
  }
  else if(req.params.max == 0)
  {
    query.cost = {$gt: req.params.min};
  }

  Product.find(query, function (err, products) {
    if (err) return next(err);
    res.json(products);
  }).limit(parseInt(req.params.size)).skip((parseInt(req.params.page))*req.params.size);
});

/* POST /products */
router.post('/', function(req, res, next) {
    Product.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });

/* GET /products/id */
router.get('/:id', function(req, res, next) {
    Product.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });

/* PUT /products/:id */
router.put('/:id', function(req, res, next) {
    Product.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });

  /* POST /products */
router.post('/sold', function(req, res, next) {
  console.log(req.body.length);

  for(i = 0; i<req.body.length; i++)
  {
    Product.findByIdAndUpdate(req.body[i]._id, {sold: true}, function (err, post) {
      if (err) return next(err);
      //res.json(post);
    });
  }
});

module.exports = router;