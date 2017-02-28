(function() {
    'use strict';
    angular.module('hash').factory('CaptureStamp', CaptureStamp);

    function CaptureStamp($q, Image1, createfolder, $ionicLoading) {
        var self = this;
        var service = {};
        service.CapturedStamp = '';
        service.Capture = function() {
            service.CapturedStamp = '';
            var q = $q.defer();
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: 1,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            }

            navigator.camera.getPicture(function(imageData) {
                $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner> Working' });
                service.CapturedStamp = "data:image/jpeg;base64," + imageData;
                q.resolve();
            }, service.errorCallback, options);
            return q.promise;
        }


        service.errorCallback = function() {
            $ionicLoading.hide();
            console.log("e")
        }

        return service;
    }
})();
