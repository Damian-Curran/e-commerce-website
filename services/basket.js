angular.module('app')
.factory('Basket', ['$resource', function($resource){
    return $resource('/baskets/addToBasket', null, {
    });
  }])