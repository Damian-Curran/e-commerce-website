angular.module('app')
.controller('indexCtrl', ['$scope', '$routeParams', '$location', 'indexService', 'Authentication', function ($scope, $routeParams, $location, indexService, Authentication) {
    var stored = Authentication.get_token();
    indexService.user = stored;
    $scope.template = indexService;
  
    $scope.categories = ["Electronics", "Gaming", "Farm", "Literature"];
  
    $scope.search = function(x)
    {
      var query = '';
  
      if($scope.category != null)
      query += $scope.category;
  
      query += ('?searchfor=' + x);
  
      $location.url(query);
    }
  
    $scope.selectCategory = function(x)
    {
      var query = x;
  
      $location.url(query);
    }
  
    $scope.select = function()
    {
      var query = '';
  
      if($scope.category != null)
        query += $scope.category;
  
      if($scope.min != null)
        query += ('?min=' + $scope.min);
  
      if($scope.max != null)
        query += ('&max=' + $scope.max);
  
      $location.url(query);
    }
  
    $scope.login = function(){
      $location.url('/login');
    }
  
    $scope.logout = function(){
      $location.url('/logout');
    }
  
    $scope.basket = function(){
      if(indexService.user != '')
      {
        $location.url('/viewBasket');
      }
      else{
        $location.url('/login');
      }
    }
  
    $scope.soldItems = function(){
      if(indexService.user != '')
      {
        $location.url('/userProducts' + "?sold");
      }
      else{
        $location.url('/login');
      }
    }
  
    $scope.boughtItems = function(){
      if(indexService.user != '')
      {
        $location.url('/userProducts' + "?bought");
      }
      else{
        $location.url('/login');
      }
    }

    $scope.sellingItems = function(){
      if(indexService.user != '')
      {
        $location.url('/userProducts' + "?selling");
      }
      else{
        $location.url('/login');
      }
    }
  
    $scope.creditCard = function(){
      $location.url('/createCard');
    }
  
    $scope.editUser = function(){
      if(indexService.user != '')
      {
        $location.url('/editUser');
      }
      else{
        $location.url('/login');
      }
    }
    $scope.createItem = function(){
      if(indexService.user != '')
      {
        $location.url('/createItem');
      }
      else{
        $location.url('/login');
      }
    }
    $scope.register = function(){
      $location.url('/register');
    }
    $scope.home = function(){
      $location.url('/');
    }
  }])