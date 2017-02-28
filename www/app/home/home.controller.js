(function() {
    'use strict'
    angular.module('hash').controller('homeCtrl', homeCtrl);

    function homeCtrl(localStorageService, createfolder, db, $ionicModal, CheckSetting, $localStorage, $state, tost, $scope, $timeout, $rootScope, $ionicLoading, configuration) {
        var self = this;
        CheckSetting.CheckDefault();
        self.cssColor = configuration.CssColors;
        self.platforms = configuration.platforms;
        self.setting = localStorageService.get('setting');
        self.suggestions = localStorageService.get('HashSuggestions')
        self.done = function() {
            CheckSetting.AddNewSuggestion(self.setting);
            localStorageService.set('setting', self.setting);
            tost.notify("Setting saved", 'top');

        }

        self.reset = function() {
            CheckSetting.SetDefault();
            self.setting = localStorageService.get('setting');
            tost.notify('Default settings applied', 'center');
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
            $scope.modal.remove();
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
                if ($scope.image == 'data:,') {
                    return self.showHash();
                }
                $ionicModal.fromTemplateUrl("app/home/preview.html", {
                    scope: $scope
                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                    $ionicLoading.hide();
                });
            }, 2000);

        }

        self.openSignature = function() {
            $ionicModal.fromTemplateUrl("app/home/signature.html", {
                scope: $scope
            }).then(function(modal) {
                var location = "file:///storage/emulated/0/Mystamp/";
                db.getAllClips(location).then(function(res) {
                    if (res.length > 0) {
                        $scope.signatures = res;
                        $scope.signatue = modal;
                        $scope.signatue.show();
                    } else {
                        tost.notify('Signatre not found, Draw a signature first', 'top');
                        $state.go('tab.clips');
                    }
                });

                $ionicLoading.hide();
            });
        }


        $scope.signaturecloseModal = function() {
            $scope.signatue.hide();
            $scope.signatue.remove();
        }


        $scope.SelectSignature = function(data) {
            localStorageService.set('SelectedSign', data.nativeURL);
            for (var i = 0; i < $scope.signatures.length; i++) {
                if (data.nativeURL === $scope.signatures[i].nativeURL)
                    $scope.signatures[i].selected = 'SignatureSelected';
                else
                    $scope.signatures[i].selected = '';

            }
        }

        $scope.go = function() {
            $scope.signaturecloseModal();
            $state.go('tab.clips');
        }



        var opts = {
            quality: 80,
            width: 200,
            height: 100,
            frames: 10,
            timestamp: true, // add timestamping to frames
            offset: -20 // start converting 20 seconds from the end
        }



        // $timeout(function() {
        //     togif('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', opts, function(blob) {
        //         createfolder.savePicture('oo2o.gif', blob)
        //         $scope.blob = blob;
        //         // do sth with blob
        //     });


        // }, 10000);

        // self.typingStarted = function() {
           
        // }


        self.startWith = function(actual, expected) {
            var lowerStr = (actual + "").toLowerCase();
            return lowerStr.indexOf(expected.toLowerCase()) === 0;
        }



    }
})();
