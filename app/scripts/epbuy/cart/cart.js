'use strict';

angular.module('EPBUY')
    .controller('CartCtrl', function ($scope, $state, $ionicPopup, $timeout, AREA) {

        // var area = new AREA.GetArea();
        // console.log(area);

        $scope.cartNum = 0;
        $scope.cartPrice = 0;

        $scope.totalNumber = function (n, p) { // 计算商品总&总价
            if (angular.isArray(n)) {
                for (var i = 0; i < n.length; i++) {
                    $scope.cartNum += n[i].Num;
                    $scope.cartPrice += n[i].Price * n[i].Num;
                }
            } else {
                $scope.cartNum = p ? $scope.cartNum + 1 : $scope.cartNum - 1;
                $scope.cartPrice = p ? $scope.cartPrice + n : $scope.cartPrice - n;
            }
        };

        var shoppingCart = localStorage.getItem('EPBUY_SHOPPING_CART');

        if (shoppingCart && JSON.parse(shoppingCart).length > 0) {
            $scope.shoppingCartList = JSON.parse(shoppingCart);
            $scope.totalNumber($scope.shoppingCartList);
        } else {
            $ionicPopup.alert({
                template: '购物车为空，请返回',
                buttons: [{
                    text: '朕知道了',
                    type: 'button-positive',
                    onTap: function () {
                        $state.go('epbuy.home');
                    }
                }]
            });
        }

        var hasChosenList = ''; // 多选待删除的数组

        $scope.hasChosenItem = function (e, index) {
            var el = angular.element(e.target);
            if (el.attr('checked') === 'checked') {
                hasChosenList += index;
            } else {
                hasChosenList = hasChosenList.replace(index, '');
            }
        };

        $scope.deleteGoods = function (str) { // 删除数组

            if (!str) {
                return false;
            }

            var tempArr = [],
                deleteArr = [];

            for (var i = 0; i < $scope.shoppingCartList.length; i++) {
                var isExist = new RegExp(i).test(str);
                if (isExist) {
                    $scope.shoppingCartList[i].removing = true;
                    deleteArr.push($scope.shoppingCartList[i]);
                } else {
                    if (!$scope.shoppingCartList[i].removing) {
                        tempArr.push($scope.shoppingCartList[i]);
                    }
                }
            }

            $timeout(function () {

                $scope.cartNum = 0;
                $scope.cartPrice = 0;
                $scope.totalNumber(tempArr);

                if (tempArr.length > 0) {
                    localStorage.setItem('EPBUY_SHOPPING_CART', JSON.stringify(tempArr));
                } else {
                    localStorage.removeItem('EPBUY_SHOPPING_CART');
                    $ionicPopup.alert({
                        template: '购物车为空，请返回',
                        buttons: [{
                            text: '朕知道了',
                            type: 'button-positive',
                            onTap: function () {
                                $state.go('epbuy.home');
                            }
                        }]
                    });
                }

                for (var i = 0; i < deleteArr.length; i++) { //移除隐藏元素
                    deleteArr[i].removed = true;
                }

                // console.log(tempArr);
            }, 400);
        };

        $scope.deleteMoreGoods = function (e) {
            var el = angular.element(e.target);

            if (el.text() === '编辑') {
                el.text('删除');
                $scope.moreGoodsChoos = true;
                hasChosenList = '';

            } else {
                el.text('编辑');
                $scope.moreGoodsChoos = false;
                $timeout(function () {
                    $scope.deleteGoods(hasChosenList);
                }, 400);
            }
        };

        $scope.placeTheOrder = function () {
            console.log('下单');
        };

    });