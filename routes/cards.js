var express = require('express');
var router = express.Router();
var stripe = require('stripe')("sk_test_VZK01VfHuuOdrwNG6E21Q7N4");

var Card = require('../models/Card.js');

router.post('/:id', function(req, res, next) {
    stripe.tokens.create({
        
       card: { "number": req.body.number,
        "exp_month": req.body.month,
        "exp_year": req.body.year,
        "cvc": req.body.cvc,
        }
    }, function(err, token) {
        if(err != null)
        {
            res.json(err.msg);
        }
        else{
            res.json(token);
        }
    });
});

router.post('/', function(req, res, next) {
    stripe.charges.create({
        amount: 3000,
        currency: "eur",
        source: req.body.id, // obtained with Stripe.js
        description: "Charge for michael.thompson@example.com"
      });
});

module.exports = router;