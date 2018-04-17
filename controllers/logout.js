angular.module('app')
  //dependancy injection
  .controller('logoutController', ['indexService', 'Authentication', function (indexService, Authentication) {
    //gets stored token
    var stored = Authentication.get_token();
    //sets service variable to empty
    indexService.user = '';
    //deletes token
    Authentication.delete_token(stored);
  }])