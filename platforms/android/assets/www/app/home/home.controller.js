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

        self.reset = function() {
            CheckSetting.SetDefault();
            self.setting = localStorageService.get('setting');
            tost.notify('Default settings applied', 'center');
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
            $scope.modal.remove()
        };
        var startimg = "assest/img/bg.png";
        $scope.image = startimg;
        $scope.textOverlay = "";

        self.showHash = function() {
            $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner> Preparing' })
            var canvas = document.getElementById('tempCanvas');
            var context = canvas.getContext('2d');
            var source = new Image();
            source.src = startimg;
            canvas.width = source.width;
            canvas.height = source.height;
            context.drawImage(source, 0, 0);
            context.font = "100px impact";
            var textWidth = context.measureText($scope.frase).width;
            if (textWidth > canvas.offsetWidth) {
                context.font = "60px impact";
            }
            context.textAlign = 'right';
            context.fillStyle = self.setting.hashtagColor;
            if (localStorageService.get('setting').hashtagShadow === true) {
                context.shadowColor = localStorageService.get('setting').shadowColor;
                context.shadowBlur = 30;
            }
            context.fillText('#' + localStorageService.get('setting').hash, canvas.width - 20, canvas.height - 35);
            var imgURI = canvas.toDataURL();
            $timeout(function() {
                $scope.image = imgURI;
                $ionicModal.fromTemplateUrl("app/home/preview.html", {
                    scope: $scope
                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                    $ionicLoading.hide();
                });
            }, 1000);
        }
    }
})();
