(function() {
    'use strict'
    angular.module('hash').controller('homeCtrl', homeCtrl);

    function homeCtrl(localStorageService, db, $ionicModal, CheckSetting, $localStorage, $state, tost, $scope, $timeout, $rootScope, $ionicLoading, configuration) {
        var self = this;
        CheckSetting.CheckDefault();
        self.cssColor = configuration.CssColors;
        self.platforms = configuration.platforms;
        self.setting = localStorageService.get('setting');

        self.done = function() {
            localStorageService.set('setting', self.setting);
        }

        self.showHash = function() {
            $ionicModal.fromTemplateUrl("app/home/preview.html", {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }

        self.reset = function() {
            CheckSetting.SetDefault();
            self.setting = localStorageService.get('setting');
            tost.notify('Default settings applied', 'center');
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
            $scope.modal.remove()
        };
    }
})();
