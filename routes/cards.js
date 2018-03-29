var express = require('express');
var router = express.Router();
var stripe = require('stripe')("sk_test_VZK01VfHuuOdrwNG6E21Q7N4");

router.post('/:id', function(req, res, next) {
    console.log("req.body " + req.body);

    stripe.tokens.create({
        
       card: { "number": req.body.number,
        "exp_month": req.body.month,
        "exp_year": req.body.year,
        "cvc": req.body.cvc,
        }
    }, function(err, token) {
        if(err != null)
        {
            console.log(err.message);
            res.json(err.msg);
        }
        else{
            console.log(token);
            res.json(token);
        }
    });

});

module.exports = router;