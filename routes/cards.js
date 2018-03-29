var express = require('express');
var router = express.Router();
var stripe = require('stripe')("sk_test_VZK01VfHuuOdrwNG6E21Q7N4");

router.post('/:id', function(req, res, next) {
    console.log("req.body " + req.body);

});

module.exports = router;