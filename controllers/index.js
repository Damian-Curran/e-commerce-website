angular.module('app')
  //dependancy injection
  .controller('indexCtrl', ['$scope', '$location', 'indexService', 'Authentication', function ($scope, $location, indexService, Authentication) {
    //get current signed in user
    var stored = Authentication.get_token();
    //if there is a user
    if (stored != null) {
      //set user to service
      indexService.user = stored;
    }
    //give service scope to page
    $scope.template = indexService;

    //categories for select menu
    $scope.categories = ["Electronics", "Gaming", "Farm", "Literature"];

    //search function for search box on index page
    $scope.search = function (x) {
      var query = '';

      //checks if category is also selected
      if ($scope.category != null)
        query += $scope.category;

        if(x != '' && x != null)
        {
          query += ('?searchfor=' + x);
        }

      $location.url(query);
    }

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

    //category selected
    $scope.selectCategory = function (x) {
      var query = x;

      //passes query to product controller where more will happen there
      $location.url(query);
    }

    //some routing for login
    $scope.login = function () {
      $location.url('/login');
    }

    $scope.logout = function () {
      $location.url('/logout');
    }

    //some condition checking against user logged in or not
    $scope.basket = function () {
      if (indexService.user != '') {
        $location.url('/viewBasket');
      }
      else {
        $location.url('/login');
      }
    }

    $scope.soldItems = function () {
      if (indexService.user != '') {
        $location.url('/userProducts' + "?sold");
      }
      else {
        $location.url('/login');
      }
    }

    $scope.boughtItems = function () {
      if (indexService.user != '') {
        $location.url('/userProducts' + "?bought");
      }
      else {
        $location.url('/login');
      }
    }

    $scope.sellingItems = function () {
      if (indexService.user != '') {
        $location.url('/userProducts' + "?selling");
      }
      else {
        $location.url('/login');
      }
    }

    $scope.creditCard = function () {
      $location.url('/createCard');
    }

    $scope.editUser = function () {
      if (indexService.user != '') {
        $location.url('/editUser');
      }
      else {
        $location.url('/login');
      }
    }
    $scope.createItem = function () {
      if (indexService.user != '') {
        $location.url('/createItem');
      }
      else {
        $location.url('/login');
      }
    }
    $scope.register = function () {
      $location.url('/register');
    }
    $scope.home = function () {
      $location.url('/');
    }
  }])