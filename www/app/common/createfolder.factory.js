(function() {
    'use strict';
    angular.module('hash').factory('createfolder', createfolder);

    function createfolder(localStorageService, $cordovaFile, $q) {
        var service = {};
        service.create = function() {
            document.addEventListener("deviceready", function() {
                var folderName = 'Mystamp';
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

                function fileSystemSuccess(fileSystem) {
                    console.log(fileSystem)
                    var download_link = encodeURI(URL);
                    var directoryEntry = fileSystem.root;
                    directoryEntry.getDirectory(folderName, {
                        create: true,
                        exclusive: false
                    }, onDirectorySuccess, onDirectoryFail);
                }

                function onDirectorySuccess(parent) {
                    localStorageService.set('Filepermission', true);
                }

                function onDirectoryFail(error) {
                    alert('Error 403, Insufficient permission   ');
                }

                function fileSystemFail(evt) {
                    console.log(evt.target.error.code);
                }
            });
        }

        service.savePicture = function(name, blob) {
            var q = $q.defer();
            $cordovaFile.writeFile("file:///storage/emulated/0/Mystamp/", name, blob, true)
                .then(function(success) {
                    q.resolve(success);
                }, function(error) {
                    alert("Error 403, Insufficient permissions");
                    q.reject(error);
                });

            return q.promise;
        }



        return service;
    }
})();
