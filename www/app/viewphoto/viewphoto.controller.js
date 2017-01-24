(function() {
    'use strict';
    angular.module('hash').controller('viewPhotoCtrl', viewPhotoCtrl);

    function viewPhotoCtrl(localStorageService, db, $ionicModal, Gallery, $cordovaFile, Image1, $stateParams, $cordovaFileTransfer, $cordovaSocialSharing, $scope, $timeout, $rootScope, $ionicLoading) {
        var self = this;
        var fileName;
        $scope.zoomMin = 1;
        // if ($stateParams.id) {
        //     var selected = db.GetDataById($stateParams.id);
        //     $scope.image = selected.image;
        //     self.textOverlay = selected.tweet;
        // } else {
        //     if (Gallery.pics) {
        //         $scope.MulImage = Gallery.pics;
        //     } else {
        //         $scope.image = "data:image/jpeg;base64," + Image1.binary;
        //         var canvas = document.getElementById('tempCanvas');
        //         var context = canvas.getContext('2d');
        //         createOverlay();
        //     }
        // }
        // $ionicLoading.hide();


        $scope.MulImage = [
            'assest/img/a.jpg' ,
            'assest/img/b.jpg',
            'assest/img/c.jpg'
        ];

       for(var i =0 ; i<=$scope.MulImage.length; i++){
         createOverlay($scope.MulImage[i]);
       }










        function createOverlay(image12) {
            var source = new Image();
            source.src = image12;
            canvas.width = source.width;
            canvas.height = source.height;
            console.log(canvas);
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
                $scope.image = imgURI;
                imgURI = imgURI.replace(/^data:image\/[a-z]+;base64,/, "");
                var blob = Image1.baseUpload(imgURI);
                console.log(blob)
            //     var name = new Date().valueOf() + '.png';
            // //     $cordovaFile.writeFile(cordova.file.externalDataDirectory, name, blob, true)
            // //         .then(function(success) {
            // //             fileName = cordova.file.externalDataDirectory + name;
            // //         }, function(error) {
            // //             alert("Error 403, Insufficient permissions")
            // //         });
            }, 100);
        }




        $scope.tweet = function() {
            var tweetData = localStorageService.get('setting');
            if ($stateParams.id) {
                OpenTwitter();
            } else {
                db.InsertDb(tweetData.title, self.textOverlay, fileName);
                OpenTwitter();
            }

        }

        function OpenTwitter() {
            $ionicLoading.hide();
            $cordovaSocialSharing
                .shareViaTwitter(self.textOverlay, $scope.image)
                .then(function(result) {
                    console.log(result)
                }, function(err) {
                    console.log(err)

                });
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
