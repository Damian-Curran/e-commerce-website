angular.module('app')
  //dependancy injection
  .controller('ProductController', ['$scope', '$routeParams', 'Products', '$location', '$resource', 'ViewProducts', function ($scope, $routeParams, Products, $location, $resource, ViewProducts) {
    //a few scopes used for different page features
    $scope.filter = false;
    $scope.currentPage = 1;
    var query = '';
    //function for hasChanged property of min and max prices
    $scope.select = function () {
      var query = '';

      if ($scope.category != null)
        query += $scope.category;

      if ($scope.min != null)
        query += ('?min=' + $scope.min);

      if ($scope.max != null)
        query += ('&max=' + $scope.max);

        $location.url(query);
    }

    //resources for product functions
    var productCount = $resource('/products/count/');
    var categorySearch = $resource('/products/:size/:page/:category/:min/:max/:search');

    //variables holding some on route paramaters
    var min = $routeParams.min;
    var max = $routeParams.max;
    var search = $routeParams.searchfor;
    var category = $routeParams.category;

    $scope.search = $routeParams.searchfor;
    search = $scope.search;

    $scope.min = $routeParams.min;
    $scope.max = $routeParams.max;

    //checks against condition null for each variable
    if ($routeParams.min == null) {
      min = 0;
    }

    if ($routeParams.max == null) {
      max = 0;
    }

    if ($routeParams.searchfor == null) {
      search = 0;
    }

    if ($routeParams.category == null) {
      $scope.filter = true;
      category = 0;
    }

    //counts products with the search paramaters
    productCount.save({ category: category, min: min, max: max, search: search }, function (counted) {
      //math calculation to round up(for pagination, cant say there is 3.2 pages)
      $scope.pages = Math.ceil(counted.count / 15);
    });

    //handles pagination for previous
    $scope.previous = function () {
      //sets current page to -1 of current page
      $scope.currentPage -= 1;
      //queries products collection
      $scope.products = categorySearch.query({ size: 15, page: $scope.currentPage - 1, category: category, min: min, max: max, search: search });
    }

    //handles pagination for next
    $scope.next = function () {
      //adds 1 to current page
      $scope.currentPage += 1;
      //queries products collection
      $scope.products = categorySearch.query({ size: 15, page: $scope.currentPage - 1, category: category, min: min, max: max, search: search });
    }

    //queries product collection with selected paramaters
    $scope.products = categorySearch.query({ size: 15, page: $scope.currentPage - 1, category: category, min: min, max: max, search: search });

    //goes to product detail controller which inspects a single product
    //switches view
    $scope.go = function (index) {
      $location.url('/product/' + index);
    }
  }])