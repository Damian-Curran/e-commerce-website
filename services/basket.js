angular.module('app')
  //basket service for accessing a resource to route 'baskets'
  .factory('Basket', ['$resource', function ($resource) {
    return $resource('/baskets/addToBasket', null, {
    });
  }])