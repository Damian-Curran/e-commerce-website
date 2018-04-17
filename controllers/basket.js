angular.module('app')
//dependancy injection of services
.controller('basketController', ['$scope', '$location', 'indexService', '$resource', function ($scope, $location, indexService, $resource) {
    var user = indexService.user;
  
    //resources to call methods in routes
    var User = $resource('/baskets/:id', {id: user});
    var GetCards = $resource('/cards/:id');
    var Purchase = $resource('/cards/');
    var boughtItem = $resource('/products/sold/:id', {id: user});
    var removeItem = $resource('/baskets/:user/:prodId', {user: '@user', prodId: '@prodId'});
    
    //gets returned an array of items
    //passes in the current logged in users username on call
    var itemBasket = User.query();
    //sets scope of itembaskey to the array
    $scope.itemBasket = itemBasket;
  
    //gets the scope of the button with ng-model 'go'
    //receives index of product
    $scope.go = function(index){
      //routes to product with route param index
      $location.url('/product/' + index);
    }
  
    //scope of button
    //changes what is show on page by changing 'show' variable
    $scope.purchase = function(){
      $scope.show = 1;
  
      //receives all cards associated with an account
      GetCards.query({id: user}, function(resp){
        var array = [];
  
        //loops through cards
        for(i = 0; i<resp[0].brand.length; i++)
        {
          array.push({username: resp[0].username, brand: resp[0].brand[i], cardNo: resp[0].cardNo[i], token: resp[0].token[i]});
        }
        //sets cards scope to array
        $scope.cards = array;
      });
    }
  
    //function to remove an item from your basket
    $scope.remove = function(prodId){
      removeItem.delete({user: user, prodId: prodId})
      var itemBasket = User.query();
      $scope.itemBasket = itemBasket;
    }
  
    //selects card to continue purchase with
    $scope.useCard = function(card){
      var array = [];
      array.push(card);
      $scope.cards = array;
      $scope.show = 2;
    }
  
    //confirms purchase with selected card
    $scope.confirm = function()
    {
      //gets total cost of basket
      User.query(function(resp){
        var totalCost = 0;
        for(i = 0; i< itemBasket.length; i++){
          totalCost += itemBasket[0].cost;
        }

        //adds cards to details array
        var details = [];
        details = $scope.cards;
        //pushes totalcost onto details
        details.push({totalCost: totalCost})
        //passes details to card function in routes for transaction purpuses
        Purchase.save(details);
        //emptys users basket
        User.delete();
    
        //calls function to set the 'buyer' field in products to username of purchaser
        boughtItem.save(resp);
    
        //empties itemBasket array
        $scope.itemBasket = [];
        //empties card array
        $scope.cards = [];
      });
    }
  }])