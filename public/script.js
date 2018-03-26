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
  return $resource('/users/', null, {
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
      user: 'functionToBeAdded'
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
  $scope.go2 = function(){
    $location.url('/hello');
  }
  $scope.register = function(){
    $location.url('/register');
  }
}])
.controller('ProductDetailCtrl', ['$scope', '$routeParams', 'Products', '$location', function ($scope, $routeParams, Products, $location) {
  $scope.product = Products.get({id: $routeParams.id });
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
  $scope.users = Users.query();
  $scope.save = function(){
    if($scope.name != null && $scope.username != null && $scope.email != null && $scope.password != null && $scope.password2 != null){
      var user = new Users({ name: $scope.name, username: $scope.username, email: $scope.email, password: $scope.password, password2: $scope.password2 });
      $scope.name = "test";
      //$location.url('/');
      user.$save(function(){
        $scope.users.push(user);
      });
    }
    else{
      $scope.name = "failed";
    }
  }
}])
.controller('indexCtrl', ['$scope', '$routeParams', '$location', 'indexService', function ($scope, $routeParams, $location, indexService) {
  $scope.template = indexService;
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
    .when('/hello', {
      templateUrl: '/views/createProduct.ejs',
      controller: 'CreateProductController'
    })
    .when('/register', {
      templateUrl: '/views/register.ejs',
      controller: 'RegisterController'
    })
    .when('/:id', {
      templateUrl: '/views/productDetails.ejs',
      controller: 'ProductDetailCtrl'
   });
}]);