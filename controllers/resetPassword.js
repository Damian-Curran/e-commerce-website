angular.module('app')
.controller('passwordController', ['$scope', '$routeParams', '$location', 'indexService', '$resource', function ($scope, $routeParams, $location, indexService, $resource) {
    var user = indexService.user;
  
    var User = $resource('/users/reset/:username', {username: '@username'});
    var Update = $resource('/users/newPassword/:password/:token', {password: '@pass', token: $routeParams.token});

    $scope.submit = function(){
      var username = $scope.username;
      User.save({username:username});
    }

    $scope.newPassword = function(){
        var pass = $scope.password;
        Update.save({pass: pass});
        $location.url("/login");
      }
  }])