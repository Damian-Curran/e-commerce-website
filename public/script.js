angular.module('app', ['ngRoute', 'ngResource'])
  .config(['$routeProvider', function ($routeProvider, $locationProvider) {
    //route provider to the application for navigation
    //conditions check against $location.urls() called from controllers
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
      .when('/password', {
        templateUrl: '/views/password.ejs',
        controller: 'passwordController'
      })
      .when('/reset/:token', {
        templateUrl: '/views/resetPassword.ejs',
        controller: 'passwordController'
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