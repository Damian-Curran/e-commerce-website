angular.module('app')
    .factory('Products', ['$resource', function ($resource) {
        return $resource('/products/:id', null, {
            'update': { method: 'PUT' }
        });
    }])
    .factory('ViewProducts', ['$resource', function ($resource) {
        return $resource('/products/:size/:page', {}, {
            'query': { method: 'GET', params: { size: '@size', page: '@page' }, isArray: true }
        });
    }])