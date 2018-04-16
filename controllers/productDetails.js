angular.module('app')
.controller('ProductDetailCtrl', ['$scope', '$routeParams', 'Products', '$location', 'Basket', 'indexService', function ($scope, $routeParams, Products, $location, Basket, indexService) {
    $scope.product = Products.get({id: $routeParams.id });
    
    var user = indexService.user;
  
    var basket = new Basket({username: user, product: $routeParams.id});
  
    $scope.basket = function(){
      Basket.save(basket, function(){
      });
    }
  
    $scope.update = function(){
      Products.update({id: $scope.product.post._id}, $scope.product.post, function(){
        $location.url('/');
      });
    }

    $scope.delete = function(){
      Products.delete({id: $scope.product.post._id}, $scope.product.post, function(){
        $location.url('/');
      });
    }
  
    $scope.modal = function(src){
      $scope.imageSrc = "/uploads/" + src;
    }
  
  }])