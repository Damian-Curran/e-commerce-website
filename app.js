var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var Product = require('./models/Product');

var routes = require('./routes/index');
var products = require('./routes/products');
var users = require('./routes/users');
var baskets = require('./routes/baskets');
var cards = require('./routes/cards');

// load mongoose package
var mongoose = require('mongoose');

// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect('mongodb://localhost/e-commerce')
.then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));

var upload = multer({storage: multer.diskStorage({
    
    destination: function (req, file, callback) 
    { callback(null, './uploads');},
    filename: function (req, file, callback) 
    { callback(null, file.fieldname +'-' + Date.now()+path.extname(file.originalname));}

}),

fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return callback(/*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
}
});

var app = express();

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.post('/', upload.any(), function(req,res){
    console.log(req.body); 
    console.log(req.files);

    var c;
    var images3;

    Product.findOne({},function(err,data){
        console.log("into product");
  
        if (data) {
          console.log("if");
          c = data.unique_id + 1;
        }else{
          c=1;
        }
  
        if(req.files[2] == null)
        {
          images3 = '';
        }
        else{
          images3 = req.files[2].filename;
        }
  
        var product = new Product({
  
          unique_id:c,
          name: req.body.title,
          description: req.body.description,
          cost: req.body.cost,
          category: req.body.category,
          sold: false,
          buyer: String,
          image1:req.files[0].filename,
          image2:req.files[1].filename,
          image3:images3,
          seller: req.body.user,
        });
  
        console.log(product);
  
        product.save(function(){
          if(err)
            console.log(err);
          else
            res.redirect('/');
        });
  
      })
});

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(__dirname + '/public'));
app.use('/views', express.static(__dirname + '/views'));
app.use('/uploads', express.static(__dirname + '/uploads'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use('/products', products);
app.use('/users', users);
app.use('/baskets', baskets);
app.use('/cards', cards);
  
module.exports = app;