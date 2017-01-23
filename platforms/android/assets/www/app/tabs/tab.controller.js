(function() {
    'use strict';
    angular.module('hash').controller('tabCtrl', tabCtrl);

    function tabCtrl(localStorageService, tost, $localStorage, $state, Image1, $ionicModal, $scope, $ionicLoading) {
        var self = this;
        self.capture = function() {
            var setting = localStorageService.get('setting');
            if (setting && setting.title && setting.hash) {
                Image1.takePhoto1().then(function(res) {
                    $state.go('viewphoto');
                });
            } else {
                tost.notify('Title and Hashtag should not be left empty', 'top');
            }
            $scope.go = function() {
                $state.go('tab.dash')
            }
            $scope.onTabSelected = function() {
                $localStorage.$reset();
            }
        }
    }
})();
