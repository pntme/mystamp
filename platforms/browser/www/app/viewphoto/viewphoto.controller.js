(function() {
    'use strict';
    angular.module('hash').controller('viewPhotoCtrl', viewPhotoCtrl);

    function viewPhotoCtrl(localStorageService, db, $cordovaFile, Image1, $stateParams, $cordovaFileTransfer, $cordovaSocialSharing, $scope, $timeout, $rootScope, $ionicLoading) {
        var self = this;
        var fileName;
        if ($stateParams.id) {
            var selected = db.GetDataById($stateParams.id);
            $scope.image = selected.image;
            self.textOverlay = selected.tweet;
        } else {
            $scope.image = "data:image/jpeg;base64," + Image1.binary;
            var canvas = document.getElementById('tempCanvas');
            var context = canvas.getContext('2d');
            createOverlay();
        }
        $ionicLoading.hide();

        function createOverlay() {
            var source = new Image();
            source.src = $scope.image;
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
            context.shadowColor = 'black';
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
                var name = new Date().valueOf() + '.png';
                $cordovaFile.writeFile(cordova.file.externalDataDirectory, name, blob, true)
                    .then(function(success) {
                        fileName = cordova.file.externalDataDirectory + name;
                    }, function(error) {
                        alert("Error 403, Insufficient permissions")
                    });
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
    }
})();
