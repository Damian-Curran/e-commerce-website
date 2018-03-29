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
.controller('ProductController', ['$scope', '$routeParams', 'Products', '$location', function ($scope, $routeParams, Products, $location) {
  $scope.editing = [];
  $scope.products = Products.query();

  //myService.set("i am shared data");

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
    .when('/:id', {
      templateUrl: '/views/productDetails.ejs',
      controller: 'ProductDetailCtrl'
   });
}]);