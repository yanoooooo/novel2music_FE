angular.module("novel2music").provider('crudPrvd', function() {
    var vm = this;

    vm.$get = function($q, $http, $window){
        return {
            //GET method
            get: function(url) {
                return $http({
                    method : 'GET',
                    url : url
                });
            },
            getArray: function(urls) {
                var httpUrls = [];
                for(var i in urls) {
                    httpUrls.push($http.get(urls[i]));
                }
                return $q.all(httpUrls);
            },
            //POST method
            post: function(url, data) {
                return $http({
                    method : 'POST',
                    url : url,
                    data: data,
                    headers : {
                        'Content-Type': 'application/json'
                        //'x-csrf-token': token
                    },
                    withCredentials: true
                });
            },
            //PUT method
            put: function(url, data, token) {
                return $http({
                    method : 'PUT',
                    url : url,
                    data: data,
                    headers : {
                        'Content-Type': 'application/json',
                        'x-csrf-token': token
                    },
                    withCredentials: true
                });
            },
            //DELETE method
            delete: function(url, token) {
                return $http({
                    method : 'DELETE',
                    url: url,
                    headers : {
                        'Content-Type': 'application/json',
                        'x-csrf-token': token
                    },
                    withCredentials: true
                });
            },
            //split params
            getParams: function() {
                var result = {};
                if( 1 < $window.location.search.length ) {
                    var query = $window.location.search.substring(1);
                    var parameters = query.split('&');
                    for(var i = 0; i < parameters.length; i++) {
                        var element = parameters[ i ].split('=');
                        var paramName = decodeURIComponent(element[0]);
                        var paramValue = decodeURIComponent(element[1]);
                        result[ paramName ] = paramValue;
                    }
                }
                return result;
            }
        };
    };
});
