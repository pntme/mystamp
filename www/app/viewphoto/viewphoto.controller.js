(function() {
    'use strict';
    angular.module('hash').controller('viewPhotoCtrl', viewPhotoCtrl);

    function viewPhotoCtrl(localStorageService, $location, $anchorScroll, createfolder, $state, $ionicPopup, $ionicPlatform, db, tost, $cordovaInstagram, $ionicActionSheet, $ionicModal, $cordovaFile, Image1, $stateParams, $cordovaFileTransfer, $cordovaSocialSharing, $scope, $timeout, $rootScope, $ionicLoading, $ionicHistory) {
        var self = this;
        var fileName;
        var hashWidth;
        $scope.shareclicked = false;
        var setting = localStorageService.get('setting')
        $scope.zoomMin = 1;
        var savedToMemory = false;
        var TagedImages = [];

        if ($stateParams.id) {
            savedToMemory = true;
            var selected = db.GetDataById($stateParams.id);
            $scope.MulImage = [selected.image];
            $scope.image = selected.image;
            self.textOverlay = selected.sub;
        } else {
            savedToMemory = false;
            hashWidth = "80px impact";
            $scope.MulImage = ["data:image/jpeg;base64," + Image1.binary];
            for (var i = 0; i < $scope.MulImage.length; i++) {
                createOverlay($scope.MulImage[i], 'image' + i);
            }
        }

        // $scope.MulImage = ["assest/img/bg.png"];

        function createOverlay(image12, dynamicId) {
            var signature = new Image();
            signature.src = localStorageService.get("SelectedSign");
            $timeout(function() {
                var canvas = document.getElementById(dynamicId);
                var context = canvas.getContext('2d');
                var source = new Image();
                source.src = image12;
                canvas.width = source.width;
                canvas.height = source.height;

                context.drawImage(source, 0, 0);
                if (setting.IsSignature == true && localStorageService.get('SelectedSign'))
                    context.drawImage(signature, 0, 0, 100, 100);

                context.font = "100px impact";
                var textWidth = context.measureText($scope.frase).width;
                if (textWidth > canvas.offsetWidth) {
                    context.font = "40px impact";

                }

                context.textAlign = 'right';
                context.fillStyle = setting.hashtagColor;
                if (setting.hashtagShadow === true) {
                    context.shadowColor = setting.shadowColor;
                    context.shadowBlur = 30;
                }

                context.fillText('#' + setting.hash, canvas.width - 10, canvas.height - 35);

                var imgURI = canvas.toDataURL();
                $timeout(function() {
                    TagedImages.push(imgURI);
                    if (TagedImages.length === $scope.MulImage.length) {
                        $scope.MulImage = TagedImages;
                        $ionicLoading.hide();
                    }
                    $scope.image = imgURI;
                    SaveData($scope.image);
                }, 100);
            }, 1000);
        }

        function SaveData(imgURI) {
            imgURI = imgURI.replace(/^data:image\/[a-z]+;base64,/, "");
            var blob = Image1.baseUpload(imgURI);
            var name = new Date().valueOf() + '.png';
            var location = 'file:///storage/emulated/0/Mystamp/';
            createfolder.savePicture(name, blob, location).then(function(res) {
                fileName = res.NativeFileURL;
            });
        }



        $scope.share = function() {
            if (setting.sharingPlatform === 'All') {
                self.SaveData();
                var hideSheet = $ionicActionSheet.show({
                    buttons: [{
                        text: '<p class="text-center">Twitter</p>'
                    }, {
                        text: '<p class="text-center">Instagram</p>'
                    }, {
                        text: '<p class="text-center">Facebook</p>'
                    }, {
                        text: '<p class="text-center">Whatsapp</p>'
                    }],
                    titleText: 'Select platform',
                    cancelText: 'Cancel',
                    cancel: function() {},
                    buttonClicked: function(index) {
                        DoAction(index);
                        return true;
                    }
                });
            } else {
                DoAction(setting.sharingPlatform)
            }
        }


        function DoAction(counter) {
            switch (parseInt(counter)) {
                case 0:
                    self.ViaTwitter();
                    break;
                case 1:
                    self.ViaInstagram();
                    break;
                case 2:
                    self.ViaFacebook();
                    break;
                case 3:
                    self.ViaWhatsapp();
                    break;
            }
        }

        self.ViaWhatsapp = function() {
            $cordovaSocialSharing.shareViaWhatsApp(self.textOverlay, $scope.image).then(self.OnSuccess, self.OnError);
        }

        self.ViaTwitter = function() {
            $cordovaSocialSharing.shareViaTwitter(self.textOverlay, $scope.image).then(self.OnSuccess, self.OnError);
        }

        self.ViaInstagram = function() {
            $cordovaInstagram.share({ image: $scope.image, caption: self.textOverlay }).then(self.OnSuccess, self.OnErrorInsta);
        }

        self.ViaFacebook = function() {
            $cordovaSocialSharing.shareViaFacebook(self.textOverlay, $scope.image).then(self.OnSuccess, self.OnError);
        }

        self.OnErrorInsta = function() {
            console.log('Insta eooro')
        }


        self.SaveData = function() {
            if (setting.keepHistory === true) {
                savedToMemory = true;
                var tweetData = localStorageService.get('setting');
                if ($stateParams.id) {
                    console.log('update query must go here');
                } else {
                    db.InsertDb(tweetData.title, self.textOverlay, fileName);
                }
            }

        }

        self.OnError = function(error) {
            tost.notify('Make sure selected platform is installed in your device', 'top');
        }

        self.OnSuccess = function(success) {
            tost.notify('Success');
            self.SaveData();
        }

        $scope.showImages = function(index, pic) {
            $scope.activeSlide = index;
            $scope.selctedImage = pic;
            $scope.showModal('app/viewphoto/zoom.html');
        };

        $scope.showModal = function(templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
            $scope.modal.remove()
        };

        $scope.StartSign = function() {
            $scope.signatureStarted = true;
        }

        $scope.SignatureFinished = function() {
            $scope.signatureStarted = false;
        }

        $scope.gotoAnchor = function(x) {
            $scope.shareclicked = !$scope.shareclicked
            var newHash = 'anchor' + x;
            if ($location.hash() !== newHash) {
                $location.hash(x);
            } else {
                $anchorScroll();
            }
        }

        $scope.$on('StampSelected', function(event, args) {
            var canvas = document.getElementById("image0");
            var nativeImage = document.getElementById("NativeImage");
            var ctx = canvas.getContext("2d");
            var image = new Image();
            image.src = args.data;
            $timeout(function() {
                ctx.globalAlpha = 0.9;
                ctx.drawImage(image, canvas.width - 210, canvas.height - 280);
                $scope.MulImage = [canvas.toDataURL()];
                $scope.image = $scope.MulImage[0];
                SaveData($scope.image);
                $ionicLoading.hide();
            });

            console.log(args);
        });

    }
})();
