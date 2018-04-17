angular.module('app')
    .factory('Users', ['$resource', function ($resource) {
        return $resource('/users/:email', null, {
            'check': { method: 'PUT' }
        });
    }])