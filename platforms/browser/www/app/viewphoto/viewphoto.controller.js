(function() {
    'use strict';
    angular.module('hash').controller('viewPhotoCtrl', viewPhotoCtrl);

    function viewPhotoCtrl(localStorageService, ShareService, db, $ionicActionSheet, $ionicModal, Gallery, $cordovaFile, Image1, $stateParams, $cordovaFileTransfer, $cordovaSocialSharing, $scope, $timeout, $rootScope, $ionicLoading) {
        var self = this;
        var fileName;
        $scope.zoomMin = 1;
        var TagedImages = [];
        if ($stateParams.id) {
            var selected = db.GetDataById($stateParams.id);
            $scope.image = selected.image;
            self.textOverlay = selected.tweet;
        } else {
            if (Gallery.pics) {
                $scope.MulImage = Gallery.pics;
            } else {
                $scope.MulImage = ["data:image/jpeg;base64," + Image1.binary];

            }
        }
        $ionicLoading.hide();


        // $scope.MulImage = [
        //     'assest/img/a.jpg',
        //     'assest/img/b.jpg',
        //     'assest/img/f.jpg'
        // ];

        for (var i = 0; i < $scope.MulImage.length; i++) {
            createOverlay($scope.MulImage[i], 'image' + i);
        }



        function createOverlay(image12, dynamicId) {
            $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner> Compiling' })
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
                    context.font = "30px impact";
                }
                context.textAlign = 'right';
                context.fillStyle = 'white';
                context.shadowColor = 'black    ';
                context.shadowBlur = 20;
                context.shadowOffsetX = 15;
                context.shadowOffsetY = 15;
                context.fillText(localStorageService.get('setting').hash, canvas.width - 20, canvas.height - 35);
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
                    // console.log(blob)
                    //     var name = new Date().valueOf() + '.png';
                    // //     $cordovaFile.writeFile(cordova.file.externalDataDirectory, name, blob, true)
                    // //         .then(function(success) {
                    // //             fileName = cordova.file.externalDataDirectory + name;
                    // //         }, function(error) {
                    // //             alert("Error 403, Insufficient permissions")
                    // //         });

                }, 100);
            }, 1000);
        }




        $scope.share = function() {
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    text: '<p class="text-center">Twitter</p>'
                }, {
                    text: '<p class="text-center">Instagram</p>'
                }, {
                    text: '<p class="text-center">Facebook</p>'
                }, {
                    text: '<p class="text-center"><span class="green">Save as Draft</span></p>'
                }],
                titleText: 'Select platform',
                cancelText: 'Cancel',
                cancel: function() {},
                buttonClicked: function(index) {
                    switch (index) {
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
                            self.SaveData();
                            break;
                    }
                    return true;
                }
            });

            // var tweetData = localStorageService.get('setting');
            // if ($stateParams.id) {
            //     OpenTwitter();
            // } else {
            //     db.InsertDb(tweetData.title, self.textOverlay, fileName);
            //     OpenTwitter();
            // }

        }




        self.ViaTwitter = function() {
            $cordovaSocialSharing.shareViaTwitter(self.textOverlay, $scope.MulImage[i]).then(self.OnSuccess, self.OnError);
        }

        self.ViaInstagram = function(description) {
            console.log('insta')
        }

        self.ViaFacebook = function(description) {
            $cordovaSocialSharing.shareViaFacebook(self.textOverlay, $scope.MulImage[i]).then(self.OnSuccess, self.OnError);
        }

        self.SaveData = function(description) {
            console.log('data');
        }

        self.OnError = function(error) {
            console.log('error', error)
        }

        self.OnSuccess = function() {
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
    }
})();
