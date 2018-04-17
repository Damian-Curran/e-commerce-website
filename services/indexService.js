angular.module('app')
    //service called indexService
    //provides a place to set siteName and current user signed in
    .factory('indexService', function () {
        return {
            siteName: 'ShopTillYouDrop',
            user: '',
        };
    })