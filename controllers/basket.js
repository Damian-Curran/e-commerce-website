angular.module('app')
.controller('basketController', ['$scope', '$routeParams', '$location', 'indexService', 'Authentication', '$resource', function ($scope, $routeParams, $location, indexService, Authentication, $resource) {
    var user = indexService.user;
  
    var User = $resource('/baskets/:id', {id: user});
    var GetCards = $resource('/cards/:id');
    var Purchase = $resource('/cards/');
    var boughtItem = $resource('/products/sold/:id', {id: user});
    var removeItem = $resource('/baskets/:user/:prodId', {user: '@user', prodId: '@prodId'});
    
    var itemBasket = User.query();
    $scope.itemBasket = itemBasket;
  
    $scope.go = function(index){
      $location.url('/product/' + index);
    }
  
    $scope.purchase = function(){
      $scope.show = 1;
  
      GetCards.query({id: user}, function(resp){
        var array = [];
  
        for(i = 0; i<resp[0].brand.length; i++)
        {
          array.push({username: resp[0].username, brand: resp[0].brand[i], cardNo: resp[0].cardNo[i], token: resp[0].token[i]});
        }
        $scope.cards = array;
      });
    }
  
    $scope.remove = function(prodId){
      removeItem.delete({user: user, prodId: prodId})
      var itemBasket = User.query();
      $scope.itemBasket = itemBasket;
    }
  
    $scope.useCard = function(card){
      var array = [];
      array.push(card);
      $scope.cards = array;
      $scope.show = 2;
    }
  
    $scope.confirm = function()
    {
      User.query(function(resp){
        var totalCost = 0;
        for(i = 0; i< itemBasket.length; i++){
          totalCost += itemBasket[0].cost;
        }
        var details = [];
        details = $scope.cards;
        details.push({totalCost: totalCost})
        //Purchase.save(details);
        User.delete();
    
        boughtItem.save(resp);
    
        $scope.itemBasket = [];
        $scope.cards = [];
      });
    }
  }])