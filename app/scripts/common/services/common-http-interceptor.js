/**
 * $http interceptor
 *
 * 1. 如果 $http 发起 request 的 URL domain 部分是以 $api 开头, 则会被自动替换为当前环境的 domain
 *
 * 例: $http.get('$api/...')
 * 可能会被替换成: $http.get('http://www.51mart.com.cn/Service/api/...')
 *
 * 2. response...
 *
 * 如果 ResponseStatus.Ack !== 'Success'，则认为接口获取数据失败
 */

'use strict';

angular.module('EPBUY').config(function ($provide, $httpProvider) {

    $provide.factory('gsHttpInterceptor', function ($q, ENV) {

        var gsHttpInterceptor = {

            request: function (config) {
                var raw = config.url;

                if (raw.indexOf('$api') === 0) {
                    config.url = raw.replace('$api/', ENV.getDomain());
                }

                return config || $q.when(config);
            },

            requestError: function (rejection) {
                return $q.reject(rejection);
            },

            response: function (response) {

                // if (response.data && response.data.ResponseStatus) {

                //     if (response.data.ResponseStatus.Ack !== 'Success') {

                //         return $q.reject(response);
                //     }
                // }

                return response || $q.when(response);
            },

            responseError: function (rejection) {
                return $q.reject(rejection);
            }
        };

        return gsHttpInterceptor;
    });

    $httpProvider.interceptors.push('gsHttpInterceptor');
});