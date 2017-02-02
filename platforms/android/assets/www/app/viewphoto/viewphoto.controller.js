(function() {
    'use strict';
    angular.module('hash').controller('viewPhotoCtrl', viewPhotoCtrl);

    function viewPhotoCtrl(localStorageService, $state, $ionicPopup, $ionicPlatform, ShareService, db, tost, $cordovaInstagram, $ionicActionSheet, $ionicModal,  $cordovaFile, Image1, $stateParams, $cordovaFileTransfer, $cordovaSocialSharing, $scope, $timeout, $rootScope, $ionicLoading, $ionicHistory) {
        var self = this;
        var fileName;
        var hashWidth;
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

        function createOverlay(image12, dynamicId) {
            $timeout(function() {
                var canvas = document.getElementById(dynamicId);
                var context = canvas.getContext('2d');
                var source = new Image();
                source.src = image12;
                canvas.width = source.width;
                canvas.height = source.height;
                context.drawImage(source, 0, 0);
                context.font = "100px impact";
                var textWidth = context.measureText($scope.frase).width;
               
                if (textWidth > canvas.offsetWidth) {
                    context.font ="80px impact";
                    console.log("came")
                }
                context.textAlign = 'right';
                context.fillStyle = setting.hashtagColor;
                if (setting.hashtagShadow === true) {
                    context.shadowColor = setting.shadowColor;
                    context.shadowBlur = 30;
                }

                context.fillText('#' + setting.hash, canvas.width - 20, canvas.height - 35);
                var imgURI = canvas.toDataURL();
                $timeout(function() {
                    TagedImages.push(imgURI);
                    if (TagedImages.length === $scope.MulImage.length) {
                        $scope.MulImage = TagedImages;
                        $ionicLoading.hide();
                    }
                    $scope.image = imgURI;
                    imgURI = imgURI.replace(/^data:image\/[a-z]+;base64,/, "");
                    var blob = Image1.baseUpload(imgURI);
                    var name = new Date().valueOf() + '.png';
                    $cordovaFile.writeFile(cordova.file.externalDataDirectory, name, blob, true)
                        .then(function(success) {
                            fileName = cordova.file.externalDataDirectory + name;
                        }, function(error) {
                            alert("Error 403, Insufficient permissions")
                        });

                }, 100);
            }, 1000);
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
                    console.log('twitter')
                    self.ViaTwitter();
                    break;
                case 1:
                    console.log('insta')
                    self.ViaInstagram();
                    break;
                case 2:
                    console.log('fb')
                    self.ViaFacebook();
                    break;
                case 3:
                    console.log('wa')
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
            $cordovaInstagram.share({ image: $scope.image, caption: self.textOverlay }).then(self.OnSuccess, self.OnError);
        }

        self.ViaFacebook = function() {
            $cordovaSocialSharing.shareViaFacebook(self.textOverlay, $scope.image).then(self.OnSuccess, self.OnError);
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
            console.log(error)
            tost.notify('Make sure selected platform is installed in your device', 'top');
        }

        self.OnSuccess = function() {
            self.SaveData();
            console.log('success');
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


        $ionicPlatform.registerBackButtonAction(function() {
            console.log('clicked')
        });


        document.addEventListener("deviceready", function() {
            var count = 0;
            $ionicPlatform.registerBackButtonAction(function() {
                if (setting.keepHistory === true) {
                    if (savedToMemory === false) {
                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Warning',
                            template: 'Do you want to save this media ?',
                            cancelText: 'Discard',
                            okText: 'Keep'
                        });

                        confirmPopup.then(function(res) {
                            if (res) {
                                self.SaveData();
                                $state.go('tab.chats');
                            } else {
                                $state.go('tab.dash');
                            }
                        });
                    } else {
                        $state.go('tab.chats');
                    }
                } else {
                    $state.go('tab.chats');
                }
            }, 100);
        });


      db.getAllClips().then(function(res){
        console.log(res)
      });
  
    }
})();
