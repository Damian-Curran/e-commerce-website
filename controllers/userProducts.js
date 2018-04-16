angular.module('app')
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