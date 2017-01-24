(function() {
    'use strict';
    angular.module('hash').service('Gallery', Gallery);

    function Gallery($cordovaImagePicker, $q) {
        var service = {};
        service.pics='';
        service.getPics = function() {
            var q = $q.defer();
            var pics = [];
            var options = {
                maximumImagesCount: 4,
                width: 800,
                height: 800,
                quality: 80
            };
            $cordovaImagePicker.getPictures(options).then(function(results) {
                for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);
                    pics.push(results[i]);
                }
                service.pics = pics;
                q.resolve(pics);
            }, function(error) {
                console.log('error', error);
                q.reject(error)
            });

            return q.promise;
        }

        return service;
    }


})();
