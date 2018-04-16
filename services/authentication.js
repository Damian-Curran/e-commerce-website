angular.module('app')
.factory('Authentication', function($window) {
    
    return {
  
      store_token: function(token){
        $window.sessionStorage.setItem('token', token);
      },
  
  
      get_token: function(){
        return $window.sessionStorage.getItem("token");
      },
  
      delete_token: function(token){
        $window.sessionStorage.setItem('token', '');
      }
  };
  })