angular.module('app')
.controller('cardController', ['$scope', '$routeParams', '$location', 'indexService', 'Authentication', '$resource', 'Cards', function ($scope, $routeParams, $location, indexService, Authentication, $resource, Cards) {
    var user = indexService.user;
    var User = $resource('/cards/:id', {id: user});
  
    $scope.create = function(){
      var card = new Cards({number: $scope.card.number, cvc: $scope.card.cvc, month: $scope.card.exp_month, year: $scope.card.exp_year});
      User.save(card, function(token){
      });
    }
  }])