angular.module('app')
  //dependancy injection
  .controller('RegisterController', ['$scope', '$routeParams', 'Users', '$location', function ($scope, $routeParams, Users, $location) {
    //variables used for err handling
    $scope.err = false;
    $scope.err2 = false;

    //if form fully filled, button allows function to execute
    $scope.save = function () {
      //create user object
      var user = new Users({ name: $scope.name, username: $scope.username, email: $scope.email, password: $scope.password, password2: $scope.password2, area: $scope.area, town: $scope.town, county: $scope.county });
      //call save on user object previously created
      user.$save(function (err) {
        //check for accounts registered with email from form
        if (err.emailDup == true) {
          $scope.err = true;
          $scope.showError = "Email already registered";
        }
        //check for accounts registered with username from form
        if (err.usernameDup == true) {
          $scope.err2 = true;
          $scope.showError2 = "Username already registered";
        }
      });
    }
  }])