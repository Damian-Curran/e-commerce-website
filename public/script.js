angular.module('app', ['ngRoute', 'ngResource'])
//---------------
// Services
//---------------
.factory('Products', ['$resource', function($resource){
  return $resource('/products/:id', null, {
    'update': { method:'PUT' }
  });
}])
.factory('Users', ['$resource', function($resource){
  return $resource('/users/:email', null, {
    'check': { method:'PUT' }
  });
}])
.factory('Basket', ['$resource', function($resource){
  return $resource('/baskets/addToBasket', null, {
  });
}])
.factory('Cards', ['$resource', function($resource){
  return $resource('/cards/', null, {
  });
}])
.factory('ViewProducts', ['$resource', function($resource){
  return $resource('/products/:size/:page', {}, {
    'query': {method: 'GET', params: {size: '@size', page: '@page'}, isArray: true}
  });
}])
.factory('User', function() {
  var savedData = {}
  function set(data) {
    savedData = data;
  }
  function get() {
   return savedData;
  }
 
  return {
   set: set,
   get: get
  }
 
 })
 .factory('indexService', function() {
  return {
      siteName:'ShopTillYouDrop',
      user: ''
  };
})
.factory('Authentication', function($window) {
  
  return {

    store_token: function(token){
      $window.sessionStorage.setItem('token', token);
    },


    get_token: function(){
      return $window.sessionStorage.getItem("token");
    },

    delete_token: function(token){
      $window.sessionStorage.setItem('token', '');
    }
};
})

//---------------
// Controllers
//---------------
.controller('ProductController', ['$scope', '$routeParams', 'Products', '$location', '$resource', 'ViewProducts', function ($scope, $routeParams, Products, $location, $resource, ViewProducts) {
  $scope.editing = [];
  $scope.currentPage = 1;

  var productCount = $resource('/products/count');

  productCount.get(function(counted)
  {
    $scope.pages = Math.ceil(counted[0]/15);
  });
  
  $scope.previous = function()
  {
    $scope.currentPage -= 1;
  }

  $scope.next = function()
  {
    $scope.currentPage += 1;
  }

  $scope.products = ViewProducts.query({size: 15, page: $scope.currentPage-1});

  $scope.go = function(index){
    $location.url(index);
  }
  $scope.createItem = function(){
    $location.url('/createItem');
  }
  $scope.register = function(){
    $location.url('/register');
  }
}])
.controller('ProductDetailCtrl', ['$scope', '$routeParams', 'Products', '$location', 'Basket', 'indexService', function ($scope, $routeParams, Products, $location, Basket, indexService) {
  $scope.product = Products.get({id: $routeParams.id });
  
  var user = indexService.user;

  var basket = new Basket({username: user, product: $routeParams.id});

  $scope.basket = function(){
    Basket.save(basket, function(){
    });
  }

  $scope.update = function(){
    Products.update({id: $scope.product._id}, $scope.product, function(){
      $location.url('/');
    });
  }
}])
.controller('CreateProductController', ['$scope', '$routeParams', 'Products', '$location', function ($scope, $routeParams, Products, $location) {
  $scope.products = Products.query();

  //console.log(myService.get());

  $scope.save = function(){
    if(!$scope.newProduct || $scope.newProduct.length < 1) return;
    var product = new Products({ name: $scope.newProduct, description: $scope.Description });
    product.$save(function(){
      $scope.products.push(product);
      $scope.newProduct = ''; // clear textbox
      $scope.Description = ''; // clear textbox
      $location.url('/');
    });
  }
}])
.controller('RegisterController', ['$scope', '$routeParams', 'Users', '$location', function ($scope, $routeParams, Users, $location) {
  $scope.save = function(){
    if($scope.name != null && $scope.username != null && $scope.email != null && $scope.password != null && $scope.password2 != null){
      var user = new Users({ name: $scope.name, username: $scope.username, email: $scope.email, password: $scope.password, password2: $scope.password2 });
      $scope.name = "test";
      //$location.url('/');
      user.$save(function(){
      });
    }
    else{
      $scope.name = "failed";
    }
  }
}])
.controller('indexCtrl', ['$scope', '$routeParams', '$location', 'indexService', 'Authentication', function ($scope, $routeParams, $location, indexService, Authentication) {
  var stored = Authentication.get_token();
  indexService.user = stored;
  $scope.template = indexService;

  $scope.login = function(){
    $location.url('/login');
  }

  $scope.logout = function(){
    $location.url('/logout');
  }

  $scope.basket = function(){
    $location.url('/viewBasket');
  }

  $scope.creditCard = function(){
    $location.url('/createCard');
  }
}])
.controller('loginController', ['$scope', '$routeParams', '$location', 'Users', 'indexService', 'Authentication', function ($scope, $routeParams, $location, Users, indexService, Authentication) {
  $scope.login = function(){
    if($scope.email != null && $scope.password != null){
      var user = new Users({email: $scope.email, password: $scope.password});
      
      var response = Users.check({email: $scope.email} , user, function(){
        //$location.url('/');
        console.log(response);
        var store = response.username;
        Authentication.store_token(store);
        indexService.user = store;
        $location.url('/');
      });
  }
  }
}])
.controller('logoutController', ['$scope', '$routeParams', '$location', 'Users', 'indexService', 'Authentication', function ($scope, $routeParams, $location, Users, indexService, Authentication) {
  var stored = Authentication.get_token();
  indexService.user = '';
  Authentication.delete_token(stored);
}])
.controller('basketController', ['$scope', '$routeParams', '$location', 'indexService', 'Authentication', '$resource', function ($scope, $routeParams, $location, indexService, Authentication, $resource) {
  var user = indexService.user;

  var User = $resource('/baskets/:id', {id: user});
  var GetCards = $resource('/cards/:id');
  var Purchase = $resource('/cards/');
  var boughtItem = $resource('/products/sold');
  var removeItem = $resource('/baskets/:user/:prodId', {user: '@user', prodId: '@prodId'});
  
  var itemBasket = User.query();
  $scope.itemBasket = itemBasket;

  $scope.purchase = function(){
    $scope.show = 1;

    GetCards.query({id: user}, function(resp){
      var array = [];

      for(i = 0; i<resp[0].brand.length; i++)
      {
        array.push({username: resp[0].username, brand: resp[0].brand[i], cardNo: resp[0].cardNo[i], token: resp[0].token[i]});
      }
      $scope.cards = array;
    });
  }

  $scope.remove = function(prodId){
    removeItem.delete({user: user, prodId: prodId})
  }

  $scope.useCard = function(card){
    var array = [];
    array.push(card);
    $scope.cards = array;
    $scope.show = 2;
  }

  $scope.confirm = function()
  {
    var totalCost = 0;
    for(i = 0; i< itemBasket.length; i++){
      totalCost += itemBasket[0].cost;
    }
    var details = [];
    details = $scope.cards;
    details.push({totalCost: totalCost})
    //Purchase.save(details);
    User.delete();

    boughtItem.save(itemBasket);

    $scope.itemBasket = [];
    $scope.cards = [];
  }
}])
.controller('cardController', ['$scope', '$routeParams', '$location', 'indexService', 'Authentication', '$resource', 'Cards', function ($scope, $routeParams, $location, indexService, Authentication, $resource, Cards) {
  var user = indexService.user;
  var User = $resource('/cards/:id', {id: user});

  $scope.create = function(){
    var card = new Cards({number: $scope.card.number, cvc: $scope.card.cvc, month: $scope.card.exp_month, year: $scope.card.exp_year});
    User.save(card, function(token){
    });
  }
}])
//---------------
// Routes
//---------------
.config(['$routeProvider', function ($routeProvider, $locationProvider) {

  $routeProvider
    .when('/', {
      templateUrl: '/views/products.ejs',
      controller: 'ProductController'
    })
    .when('/createItem', {
      templateUrl: '/views/createProduct.ejs',
      controller: 'CreateProductController'
    })
    .when('/register', {
      templateUrl: '/views/register.ejs',
      controller: 'RegisterController'
    })
    .when('/login', {
      templateUrl: '/views/login.ejs',
      controller: 'loginController'
    })
    .when('/logout', {
      templateUrl: '/views/logout.ejs',
      controller: 'logoutController'
    })
    .when('/viewBasket', {
      templateUrl: '/views/basket.ejs',
      controller: 'basketController'
    })
    .when('/createCard', {
      templateUrl: '/views/cardDetails.ejs',
      controller: 'cardController'
    })
    .when('/:id', {
      templateUrl: '/views/productDetails.ejs',
      controller: 'ProductDetailCtrl'
   });
}]);