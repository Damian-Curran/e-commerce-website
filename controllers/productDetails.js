angular.module('app')
  .controller('ProductDetailCtrl', ['$scope', '$routeParams', 'Products', '$location', 'Basket', 'indexService', function ($scope, $routeParams, Products, $location, Basket, indexService) {
    //get details of product clicked on
    $scope.product = Products.get({ id: $routeParams.id });

    //gets current user logged in
    var user = indexService.user;

    //create basket object 
    var basket = new Basket({ username: user, product: $routeParams.id });

    //saves basket object in collection
    $scope.basket = function () {
      Basket.save(basket, function () {
      });
    }

    //updates product with changed values
    $scope.update = function () {
      Products.update({ id: $scope.product.post._id }, $scope.product.post, function () {
        $location.url('/');
      });
    }

    //deltes product
    $scope.delete = function () {
      Products.delete({ id: $scope.product.post._id }, $scope.product.post, function () {
        $location.url('/');
      });
    }

    //opens modal to view image
    $scope.modal = function (src) {
      $scope.imageSrc = "/uploads/" + src;
    }

  }])