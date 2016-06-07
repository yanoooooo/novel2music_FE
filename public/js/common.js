angular.module("novel2music", ['ngSanitize']).value(
    'common',{
        'API_HOST' : 'http://localhost:2800',
        'API_USER' : '/v1/user/',
        'API_LOGIN' : '/v1/login/',
        'API_SCALE' : '/v1/scale/',
        'API_TIME' : '/v1/time/',
        'API_RHYTHM' : '/v1/rhythm/',
        'API_MUSIC' : '/v1/music/',
        'API_NOVEL' : '/v1/novel/',
        'API_RELATION_NOVEL' : '/v1/relation/novel/',
    }
);