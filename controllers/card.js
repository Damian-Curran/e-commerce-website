angular.module('app')
  //dependancy injection of services
  .controller('cardController', ['$scope', 'indexService', '$resource', 'Cards', function ($scope, indexService, $resource, Cards) {
    //gets current user signed in
    var user = indexService.user;
    //sets resource access to route function
    var User = $resource('/cards/:id', { id: user });

    //function on button press to add card details entered to card collection
    $scope.create = function () {
      //create card object
      var card = new Cards({ number: $scope.card.number, cvc: $scope.card.cvc, month: $scope.card.exp_month, year: $scope.card.exp_year });
      //save card to user
      User.save(card, function (token) {
      });
    }
  }])