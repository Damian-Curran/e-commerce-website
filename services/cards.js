angular.module('app')
.factory('Cards', ['$resource', function($resource){
    return $resource('/cards/', null, {
    });
  }])