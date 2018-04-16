angular.module('app')
.controller('logoutController', ['$scope', '$routeParams', '$location', 'Users', 'indexService', 'Authentication', function ($scope, $routeParams, $location, Users, indexService, Authentication) {
    var stored = Authentication.get_token();
    indexService.user = '';
    Authentication.delete_token(stored);
  }])