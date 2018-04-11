var express = require('express');
var router = express.Router();

var Product = require('../models/Product.js');

/* count /products listing. */
router.post('/count/', function(req, res, next) {
  var query = {sold: false};

  if(req.body.min != null && req.body.max != null)
  {
    query.cost = {$lt: req.body.max, $gt: req.body.min};
  }
  else if(req.body.min != null)
  {
    query.cost = {$gt: req.body.min};
  }
  else if(req.body.max != null)
  {
    query.cost = {$lt: req.body.max};
  }

  if(req.body.category != null)
  {
    query.category = req.body.category;
  }

  if(req.body.search != null)
  {
    query.name = req.body.search;
  }

  Product.count(query,function(err, counted){
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
router.get('/:size/:page/:category/:min/:max/:search', function(req, res, next) {
  var query = {sold: false};

  if(req.params.min != null && req.params.max != null)
  {
    query.cost = {$lt: req.params.max, $gt: req.params.min};
  }
  else if(req.body.min != null)
  {
    query.cost = {$gt: req.body.min};
  }
  else if(req.body.max != null)
  {
    query.cost = {$lt: req.body.max};
  }

  if(req.params.category != null)
  {
    query.category = req.params.category;
  }

  if(req.params.search != null)
  {
    query.name = req.params.search;
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
router.get('/user/:id/:option', function(req, res, next) {
  var query = {sold: true};
  
  if(req.params.option == 1)
  {
    query.buyer = req.params.id;
  }
  else{
    query.seller = req.params.id;
  }

    Product.find(query, function (err, post) {
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

/* GET /products/:id */
router.get('/:id', function(req, res, next) {
  Product.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

  /* POST /products */
router.post('/sold/:id', function(req, res, next) {
  for(i = 0; i<req.body.length; i++)
  {
    Product.findByIdAndUpdate(req.body[i]._id, {$set: {sold: true, buyer: req.params.id}}, function (err, post) {
      if (err) return next(err);
    });
  }
});

module.exports = router;