//requires
var express = require('express');
var router = express.Router();
//require stripe with secret key
var stripe = require('stripe')("sk_test_VZK01VfHuuOdrwNG6E21Q7N4");

//require card schema
var Card = require('../models/Card.js');

//function to create card in collection
router.post('/:id', function(req, res, next) {
    //creates a token for card object info
    stripe.tokens.create({
        
       card: { "number": req.body.number,
        "exp_month": req.body.month,
        "exp_year": req.body.year,
        "cvc": req.body.cvc,
        }
    }, function(err, token) {
        if(err != null)
        {
            //if err occured, res json error
            res.json(err.msg);
        }
        else{
            //create customer using token from above
            //this is done so you can use the same customer token to charge multiple times
            stripe.customers.create({
                source: token.id // obtained with Stripe.js
              }, function(err, customer) {
                  //set cardNo like this for user 
                var cardNo = "**** **** **** " + token.card.last4;
                var card = new Card({username: req.params.id, token: customer.id, cardNo:cardNo, brand: token.card.brand});
                
                //finds cards for user
                Card.find({username: req.params.id}, function (err, post) {
                    //if no cards belong to current user
                    if(post[0].username == null)
                    {
                        //create card
                        Card.create(card, function (err, post) {
                            if (err) return next(err);
                            //res.json(post);
                        });
                    }
                    else{
                        //else
                        //update existing card array, push new card to it
                        Card.update({username: req.params.id},{$push: {brand: token.card.brand, token: customer.id, cardNo: cardNo}}, function (err, post) {
                            if (err) return next(err);
                            //res.json(post);
                        });
                    }
                });
    
                res.json(token);
              });
        }
    });
});

//charging cards
router.post('/', function(req, res, next) {
    stripe.charges.create({
        amount: (req.body[1].totalCost * 100),
        currency: "eur",
        customer: req.body[0].token, // obtained with Stripe.js
        description: "Charge for " + req.body[0].username
    });
});

/* GET /card listings. */
router.get('/:id', function(req, res, next) {
    Card.find({username: req.params.id}, function (err, cards) {
      res.json(cards);
    });
  });

module.exports = router;