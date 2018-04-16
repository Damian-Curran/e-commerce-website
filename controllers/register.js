angular.module('app')
.controller('RegisterController', ['$scope', '$routeParams', 'Users', '$location', function ($scope, $routeParams, Users, $location) {
    $scope.err = false;
    $scope.err2 = false;
    $scope.save = function(){
      var user = new Users({ name: $scope.name, username: $scope.username, email: $scope.email, password: $scope.password, password2: $scope.password2, area: $scope.area, town: $scope.town, county: $scope.county });
      user.$save(function(err){
        if(err.emailDup == true)
        {
          $scope.err = true;
          $scope.showError = "Email already registered";
        }
        if(err.usernameDup == true)
        {
          $scope.err2 = true;
          $scope.showError2 = "Username already registered";
        }
      });
    }
  }])