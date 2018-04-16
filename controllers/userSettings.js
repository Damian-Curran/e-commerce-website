angular.module('app')
.controller('userSettingsController', ['$scope', '$routeParams', '$location', 'indexService', '$resource', function ($scope, $routeParams, $location, indexService, $resource) {
    var user = indexService.user;
    
    var User = $resource('/users/get/:id');
    var UpdateUser = $resource('/users/put/:id', {}, {'update': {method: 'PUT'}});
  
    $scope.user = User.query({id: user}, function(user)
    {
      $scope.area = user[0].area;
      $scope.town = user[0].town;
      $scope.county = user[0].county;
    });
  
    $scope.update = function(){
      var newInfo = {area: $scope.area, town: $scope.town, county: $scope.county};
      UpdateUser.update({id: user}, newInfo);
      $scope.user = User.query({id: user});
    }
  }])