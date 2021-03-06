'use strict';
angular.module('EPBUY')
// 回退逻辑判断
.directive('epbuyBack', function($window, $state, $stateParams) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.on('click', function() {
                var hasFrom = null;
                if ($state.is('epbuy.home')) {
                    $state.go('epbuy.guide');
                } else if ($state.is('epbuy.order-detail')) {
                    hasFrom = $stateParams.from;
                    if (hasFrom === 'paid') {
                        $state.go('epbuy.person');
                    } else {
                        $window.history.back();
                    }
                } else if ($state.is('epbuy.payment')) {
                    hasFrom = $stateParams.from;
                    var orderId = $stateParams.OrderId;
                    if (hasFrom === 'paid') {
                        $state.go('epbuy.order-detail', {
                            OrderId: orderId,
                            from: hasFrom
                        });
                    } else {
                        $window.history.back();
                    }
                } else { // 默认执行浏览器后退
                    $window.history.back();
                }
            });
        }
    };
});