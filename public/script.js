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
      user: '',
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
  $scope.filter = false;
  $scope.editing = [];
  $scope.currentPage = 1;

  var productCount = $resource('/products/count/');
  var categorySearch = $resource('/products/:size/:page/:category/:min/:max/:search');

  var min = $routeParams.min;
  var max = $routeParams.max;
  var search = $routeParams.searchfor;
  var category = $routeParams.category;

  if($routeParams.min == null)
  {
    min = 0;
  }

  if($routeParams.max == null)
  {
    max = 0;
  }

  if($routeParams.searchfor == null)
  {
    search = 0;
  }

  if($routeParams.category == null)
  {
    $scope.filter = true;
    category = 0;
  }

  productCount.save({category: category, min: min, max: max, search: search}, function(counted)
  {
    $scope.pages = Math.ceil(counted.count/15);
  });

  $scope.previous = function()
  {
    $scope.currentPage -= 1;
    //$scope.products = ViewProducts.query({size: 15, page: $scope.currentPage-1});
    $scope.products = categorySearch.query({size: 15, page: $scope.currentPage-1, category: category, min: min, max: max, search: search});
  }

  $scope.next = function()
  {
    $scope.currentPage += 1;
    //$scope.products = ViewProducts.query({size: 1, page: $scope.currentPage-1});
    $scope.products = categorySearch.query({size: 15, page: $scope.currentPage-1, category: category, min: min, max: max, search: search});
  }

  $scope.products = categorySearch.query({size: 15, page: $scope.currentPage-1, category: category, min: min, max: max, search: search});

  $scope.go = function(index){
    $location.url('/product/' + index);
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
.controller('RegisterController', ['$scope', '$routeParams', 'Users', '$location', function ($scope, $routeParams, Users, $location) {
  $scope.err = false;
  $scope.err2 = false;
  $scope.save = function(){
    var user = new Users({ name: $scope.name, username: $scope.username, email: $scope.email, password: $scope.password, password2: $scope.password2, area: $scope.area, town: $scope.town, county: $scope.county });
    user.$save(function(err){
      if(err.emailDup == true)
      {
        $scope.err = true;
        $scope.showError = "Email already registered";
      }
      if(err.usernameDup == true)
      {
        $scope.err2 = true;
        $scope.showError2 = "Username already registered";
      }
    });
  }
}])
.controller('indexCtrl', ['$scope', '$routeParams', '$location', 'indexService', 'Authentication', function ($scope, $routeParams, $location, indexService, Authentication) {
  var stored = Authentication.get_token();
  indexService.user = stored;
  $scope.template = indexService;

  $scope.categories = ["Electronics", "Gaming", "Farm", "Literature"];

  $scope.search = function(x)
  {
    var query = '';

    if($scope.category != null)
    query += $scope.category;

    query += ('?searchfor=' + x);

    $location.url(query);
  }

  $scope.selectCategory = function(x)
  {
    var query = x;

    $location.url(query);
  }

  $scope.select = function()
  {
    var query = '';

    if($scope.category != null)
      query += $scope.category;

    if($scope.min != null)
      query += ('?min=' + $scope.min);

    if($scope.max != null)
      query += ('&max=' + $scope.max);

    $location.url(query);
  }

  $scope.login = function(){
    $location.url('/login');
  }

  $scope.logout = function(){
    $location.url('/logout');
  }

  $scope.basket = function(){
    $location.url('/viewBasket');
  }

  $scope.soldItems = function(){
    $location.url('/userProducts' + "?sold");
  }

  $scope.boughtItems = function(){
    $location.url('/userProducts' + "?bought");
  }

  $scope.creditCard = function(){
    $location.url('/createCard');
  }

  $scope.editUser = function(){
    $location.url('/editUser');
  }
  $scope.createItem = function(){
    $location.url('/createItem');
  }
  $scope.register = function(){
    $location.url('/register');
  }
  $scope.home = function(){
    $location.url('/');
  }
}])
.controller('loginController', ['$scope', '$routeParams', '$location', 'Users', 'indexService', 'Authentication', function ($scope, $routeParams, $location, Users, indexService, Authentication) {
  $scope.login = function(){
    if($scope.email != null && $scope.password != null){
      var user = new Users({email: $scope.email, password: $scope.password});
      
      var response = Users.check({email: $scope.email} , user, function(){
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
  var boughtItem = $resource('/products/sold/:id', {id: user});
  var removeItem = $resource('/baskets/:user/:prodId', {user: '@user', prodId: '@prodId'});
  
  var itemBasket = User.query();
  $scope.itemBasket = itemBasket;

  $scope.go = function(index){
    $location.url('/product/' + index);
  }

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
    var itemBasket = User.query();
    $scope.itemBasket = itemBasket;
  }

  $scope.useCard = function(card){
    var array = [];
    array.push(card);
    $scope.cards = array;
    $scope.show = 2;
  }

  $scope.confirm = function()
  {
    User.query(function(resp){
      var totalCost = 0;
      for(i = 0; i< itemBasket.length; i++){
        totalCost += itemBasket[0].cost;
      }
      var details = [];
      details = $scope.cards;
      details.push({totalCost: totalCost})
      //Purchase.save(details);
      User.delete();
  
      boughtItem.save(resp);
  
      $scope.itemBasket = [];
      $scope.cards = [];
    });
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
.controller('userProductController', ['$scope', '$routeParams', '$location', 'indexService', '$resource', function ($scope, $routeParams, $location, indexService, $resource) {
  var user = indexService.user;
  var option;
  if($routeParams.sold == true)
  {
    option = 0;
  }else{
    option = 1;
  }

  $scope.go = function(index){
    $location.url('/product/' + index);
  }

  $scope.showPage = false;

  var User = $resource('/products/user/:id/:option');

  $scope.products = User.query({id: user, option: option});
}])
.controller('userSettingsController', ['$scope', '$routeParams', '$location', 'indexService', '$resource', function ($scope, $routeParams, $location, indexService, $resource) {
  var user = indexService.user;
  
  var User = $resource('/users/get/:id');
  var UpdateUser = $resource('/users/put/:id', {}, {'update': {method: 'PUT'}});

  $scope.user = User.query({id: user}, function(user)
  {
    $scope.area = user[0].area;
    $scope.town = user[0].town;
    $scope.county = user[0].county;
  });

  $scope.update = function(){
    var newInfo = {area: $scope.area, town: $scope.town, county: $scope.county};
    UpdateUser.update({id: user}, newInfo);
    $scope.user = User.query({id: user});
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
      templateUrl: '/views/createProduct.ejs'
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
    .when('/userProducts', {
      templateUrl: '/views/products.ejs',
      controller: 'userProductController'
    })
    .when('/editUser', {
      templateUrl: '/views/userSettings.ejs',
      controller: 'userSettingsController'
    })
    .when('/:category', {
      templateUrl: '/views/products.ejs',
      controller: 'ProductController'
    })
    .when('/product/:id', {
      templateUrl: '/views/productDetails.ejs',
      controller: 'ProductDetailCtrl'
   });
}]);