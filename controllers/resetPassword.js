angular.module('app')
.controller('passwordController', ['$scope', '$routeParams', '$location', 'indexService', '$resource', function ($scope, $routeParams, $location, indexService, $resource) {
    var user = indexService.user;
  
    var User = $resource('/users/reset/:username', {username: '@username'});

    $scope.submit = function(){
      var username = $scope.username;
      User.save({username:username});
    }
  }])