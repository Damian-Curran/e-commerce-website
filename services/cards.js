angular.module('app')
  //service called cards which gives access to resource
  .factory('Cards', ['$resource', function ($resource) {
    return $resource('/cards/', null, {
    });
  }])