angular.module('app')
  //dependancy injection
  .controller('userProductController', ['$scope', '$routeParams', '$location', 'indexService', '$resource', function ($scope, $routeParams, $location, indexService, $resource) {
    var user = indexService.user;
    //variable used to check menu option
    var option;

    //sets variable which will be used to point navigation
    if ($routeParams.sold == true) {
      option = 0;
    } else if ($routeParams.bought == true) {
      option = 1;
    } else {
      option = 2;
    }

    //click product to view details
    $scope.go = function (index) {
      $location.url('/product/' + index);
    }

    //dont show pagination
    $scope.showPage = false;

    //resource
    var User = $resource('/products/user/products/:id/:option');

    //queries product collection with current username and option selected above
    $scope.products = User.query({ id: user, option: option });
  }])