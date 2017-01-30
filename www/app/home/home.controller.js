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
             hash();
            // $ionicModal.fromTemplateUrl("app/home/preview.html", {
            //     scope: $scope
            // }).then(function(modal) {
            //     $scope.modal = modal;
            //     $scope.modal.show();
            //     hash();
            // });
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


        function hash() {

            var canvas = document.getElementById('tempCanvas');
            var context = canvas.getContext('2d');
            var source = new Image();
            source.src = startimg;
                canvas.width = source.width;
                canvas.height = source.height;
                context.drawImage(source, 0, 0);
                context.font = "100px impact";
                var textWidth = context.measureText($scope.frase).width;
                console.log(textWidth)
                if (textWidth > canvas.offsetWidth) {
                    context.font = "60px impact";
                }
                context.textAlign = 'right';
                context.fillStyle = 'white';
                context.shadowColor = 'red';
                context.shadowBlur = 20;
                context.shadowOffsetX = 15;
                context.shadowOffsetY = 15;
                context.fillText(localStorageService.get('setting').hash, canvas.width - 20, canvas.height - 35);
            var imgURI = canvas.toDataURL();
            $timeout(function() {
                $scope.image = imgURI;
                   $ionicModal.fromTemplateUrl("app/home/preview.html", {
             scope: $scope
         }).then(function(modal) {
                 $scope.modal = modal;
                 $scope.modal.show();
            });
            }, 200);
        }
    }
})();
