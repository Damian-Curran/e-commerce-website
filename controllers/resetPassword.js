angular.module('app')
  //dependancy injection
  .controller('passwordController', ['$scope', '$routeParams', '$location', 'indexService', '$resource', function ($scope, $routeParams, $location, indexService, $resource) {
    var user = indexService.user;

    //resources needed to access route functions
    var User = $resource('/users/reset/:username', { username: '@username' });
    var Update = $resource('/users/newPassword/:password/:token', { password: '@pass', token: $routeParams.token });

    //function accessed by button press
    $scope.submit = function () {
      var username = $scope.username;
      //calls reset function with route paramater of username
      User.save({ username: username });
    }

    //function for accessing function for setting new password
    $scope.newPassword = function () {
      var pass = $scope.password;
      //calls newPassword function in users route
      Update.save({ pass: pass });
      $location.url("/login");
    }
  }])