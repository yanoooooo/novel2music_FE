angular.module("novel2music", ['ngSanitize']).value(
    'common',{
        'API_HOST' : api_host,
        'API_USER' : '/v1/user/',
        'API_LOGIN' : '/v1/login/',
        'API_SCALE' : '/v1/scale/',
        'API_TIME' : '/v1/time/',
        'API_RHYTHM' : '/v1/rhythm/',
        'API_MUSIC' : '/v1/music/',
        'API_NOVEL' : '/v1/novel/',
        'API_TERM' : '/v1/term/',
        'API_RELATION_NOVEL' : '/v1/relation/novel/',
        'API_RELATION_TERM' : '/v1/relation/term/',
    }
);