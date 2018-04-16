angular.module('app')
.controller('userProductController', ['$scope', '$routeParams', '$location', 'indexService', '$resource', function ($scope, $routeParams, $location, indexService, $resource) {
    var user = indexService.user;
    var option;
    if($routeParams.sold == true)
    {
      option = 0;
    }else if($routeParams.bought == true){
      option = 1;
    }else{
      option = 2;
    }
  
    $scope.go = function(index){
      $location.url('/product/' + index);
    }
  
    $scope.showPage = false;
  
    var User = $resource('/products/user/products/:id/:option');
  
    $scope.products = User.query({id: user, option: option});
  }])