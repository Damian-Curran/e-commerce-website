angular.module('app')
  //sets authentication factory service
  .factory('Authentication', function ($window) {

    return {
      //sets token
      store_token: function (token) {
        $window.sessionStorage.setItem('token', token);
      },

      //returns token
      get_token: function () {
        return $window.sessionStorage.getItem("token");
      },

      //deletes token
      delete_token: function (token) {
        $window.sessionStorage.setItem('token', '');
      }
    };
  })