angular.module('app')
  //dependancy injection of needed services
  .controller('loginController', ['$scope', '$location', 'Users', 'indexService', 'Authentication', function ($scope, $location, Users, indexService, Authentication) {
    //login function
    $scope.login = function () {
      //check if email or password is null
      if ($scope.email != null && $scope.password != null) {
        //create user object of email and password
        var user = new Users({ email: $scope.email, password: $scope.password });

        //check if account with matching email
        var response = Users.check({ email: $scope.email }, user, function () {

          var store = response.username;
          //stores username locally 
          Authentication.store_token(store);
          indexService.user = store;
          //routes back to '/'
          $location.url('/');
        });
      }
    }
  }])