angular.module('app')
.controller('ProductController', ['$scope', '$routeParams', 'Products', '$location', '$resource', 'ViewProducts', function ($scope, $routeParams, Products, $location, $resource, ViewProducts) {
  $scope.filter = false;
  $scope.editing = [];
  $scope.currentPage = 1;

  var productCount = $resource('/products/count/');
  var categorySearch = $resource('/products/:size/:page/:category/:min/:max/:search');

  var min = $routeParams.min;
  var max = $routeParams.max;
  var search = $routeParams.searchfor;
  var category = $routeParams.category;

  if($routeParams.min == null)
  {
    min = 0;
  }

  if($routeParams.max == null)
  {
    max = 0;
  }

  if($routeParams.searchfor == null)
  {
    search = 0;
  }

  if($routeParams.category == null)
  {
    $scope.filter = true;
    category = 0;
  }

  productCount.save({category: category, min: min, max: max, search: search}, function(counted)
  {
    $scope.pages = Math.ceil(counted.count/15);
  });

  $scope.previous = function()
  {
    $scope.currentPage -= 1;
    //$scope.products = ViewProducts.query({size: 15, page: $scope.currentPage-1});
    $scope.products = categorySearch.query({size: 15, page: $scope.currentPage-1, category: category, min: min, max: max, search: search});
  }

  $scope.next = function()
  {
    $scope.currentPage += 1;
    //$scope.products = ViewProducts.query({size: 1, page: $scope.currentPage-1});
    $scope.products = categorySearch.query({size: 15, page: $scope.currentPage-1, category: category, min: min, max: max, search: search});
  }

  $scope.products = categorySearch.query({size: 15, page: $scope.currentPage-1, category: category, min: min, max: max, search: search});

  $scope.go = function(index){
    $location.url('/product/' + index);
  }
}])