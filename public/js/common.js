angular.module("novel2music", []).value(
    'common',{
        'API_HOST' : 'http://localhost:2800',
        'API_USER' : '/v1/user/',
        'API_LOGIN' : '/v1/login/',
    }
);