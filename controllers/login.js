angular.module('app')
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