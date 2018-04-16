var express = require('express');
var router = express.Router();

var Product = require('../models/Product.js');
var User = require('../models/User.js');

/* count /products listing. */
router.post('/count/', function(req, res, next) {
  var query = {sold: false};

  if(req.body.min != 0 && req.body.max != 0)
  {
    query.cost = {$lt: req.body.max, $gt: req.body.min};
  }
  else if(req.body.min != 0)
  {
    query.cost = {$gt: req.body.min};
  }
  else if(req.body.max != 0)
  {
    query.cost = {$lt: req.body.max};
  }

  if(req.body.category != 0)
  {
    query.category = req.body.category;
  }

  if(req.body.search != 0)
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

  if(req.params.min != 0 && req.params.max != 0)
  {
    query.cost = {$lt: req.params.max, $gt: req.params.min};
  }
  else if(req.params.min != 0)
  {
    query.cost = {$gt: req.params.min};
  }
  else if(req.params.max != 0)
  {
    query.cost = {$lt: req.params.max};
  }

  if(req.params.category != 0)
  {
    query.category = req.params.category;
  }

  if(req.params.search != 0)
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
router.get('/user/products/:id/:option', function(req, res, next) {
  var query = {};
  
  if(req.params.option == 0)
  {
    query.sold = true;
    query.buyer = req.params.id;
  }
  else if(req.params.option == 1){
    query.sold = true;
    query.seller = req.params.id;
  }else{
    query.sold = false;
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
    User.find({username: "Damian1234"}, function(err, user){
      var user = {area: user[0].area, town: user[0].town, county: user[0].county, email: user[0].email};
      res.json({post:post, user:user});
    })
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