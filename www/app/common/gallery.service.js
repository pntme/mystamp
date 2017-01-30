(function() {
    'use strict';
    angular.module('hash').service('Gallery', Gallery);

    function Gallery($cordovaImagePicker,  $ionicLoading, $q) {
        var service = {};
        service.pics = '';
        service.getPics = function() {
            var q = $q.defer();
            var pics = [];
            var options = {
                maximumImagesCount: 1,
                width: 800,
                height: 800,
                quality: 80
            };
            $cordovaImagePicker.getPictures(options).then(function(results) {
                console.log(results)
                for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);
                    pics.push(results[i]);
                }
                if (pics.length > 0) {
                    $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner> Compiling' })
                    service.pics = pics;
                    q.resolve(pics);
                } else {
                    q.reject('error')
                }
            }, function(error) {
                console.log('error', error);
                q.reject(error)
            });

            return q.promise;
        }

        return service;
    }


})();