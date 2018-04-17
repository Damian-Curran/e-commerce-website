angular.module('app')
  //dependancy injection
  .controller('userSettingsController', ['$scope', '$location', 'indexService', '$resource', function ($scope, $location, indexService, $resource) {
    var user = indexService.user;

    //resources
    var User = $resource('/users/get/:id');
    var UpdateUser = $resource('/users/put/:id', {}, { 'update': { method: 'PUT' } });

    //gets access to current signed in user details
    $scope.user = User.query({ id: user }, function (user) {
      //gives scope to user address
      $scope.area = user[0].area;
      $scope.town = user[0].town;
      $scope.county = user[0].county;
    });

    //if updated address button
    $scope.update = function () {
      //creates object for new info
      var newInfo = { area: $scope.area, town: $scope.town, county: $scope.county };
      //calls update to update user with new address
      UpdateUser.update({ id: user }, newInfo);
      //refreshes scope.user to get new user info in view
      $scope.user = User.query({ id: user });
    }
  }])