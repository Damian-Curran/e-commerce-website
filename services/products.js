angular.module('app')
    //service providing resource access of /products/:id
    .factory('Products', ['$resource', function ($resource) {
        return $resource('/products/:id', null, {
            'update': { method: 'PUT' }
        });
    }])
    //service providing access to product function
    .factory('ViewProducts', ['$resource', function ($resource) {
        return $resource('/products/:size/:page', {}, {
            'query': { method: 'GET', params: { size: '@size', page: '@page' }, isArray: true }
        });
    }])