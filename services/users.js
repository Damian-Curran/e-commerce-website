angular.module('app')
    .factory('Users', ['$resource', function ($resource) {
        return $resource('/users/:email', null, {
            'check': { method: 'PUT' }
        });
    }])
    .factory('User', function () {
        var savedData = {}
        function set(data) {
            savedData = data;
        }
        function get() {
            return savedData;
        }

        return {
            set: set,
            get: get
        }

    })