  (function() {
      'use strict';
      angular.module('hash')
          .service('Image1', ['$ionicHistory', '$timeout', '$cordovaFile', '$state', '$rootScope', '$q', '$ionicActionSheet', 'localStorageService', '$ionicLoading', imageUpload])

      function imageUpload($ionicHistory, $state, $timeout, $cordovaFile, $rootScope, $q, $ionicActionSheet, localStorageService, $ionicLoading) {
          var image = {};
          image.finalBlob = '';
          image.upload = function(file, api) {
              var def = $q.defer();
              Upload.upload({
                  url: Configurations.Hostserver + api,
                  data: file
              }).then(function(resp) {
                  $rootScope.loading = false;
                  def.resolve(resp);
              }, function(resp) {
                  $rootScope.loading = false;
                  def.reject(resp);
              }, function(evt) {
                  var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                  console.log('progress: ' + progressPercentage + '% '); //progress of loading image
              });
              return def.promise;
          };
          image.fixBinary = function(bin) {
              var length = bin.length;
              var buf = new ArrayBuffer(length);
              var arr = new Uint8Array(buf);
              for (var i = 0; i < length; i++) {
                  arr[i] = bin.charCodeAt(i);
              }
              return buf;
          };
          image.baseUpload = function(imageBase64) {
              var name = new Date().valueOf() + '.png';
              var binary = image.fixBinary(atob(imageBase64));
              var blob = new Blob([binary], { type: 'image/png', name: name });
              blob.name = name;
              blob.$ngfName = name;
              image.finalBlob = blob;
              return blob;
          };

          image.defer = '';
          image.takePhoto = function(index, options) {
              image.defer = $q.defer();
              try {
                  navigator.camera.getPicture(image.successCallback, image.errorCallback, options);
              } catch (e) {
                  image.errorCallback();
              }
              return image.defer.promise;
          };
          image.binary = '';
          image.successCallback = function(imageBase64) {
              var name = new Date().valueOf() + '.png';
              image.binary = imageBase64;
              var blob = image.baseUpload(imageBase64, name);
              image.defer.resolve(blob);
          };
          image.errorCallback = function() {
              $ionicLoading.hide();
              // beersHelper.alert("Upload Image From Your Device Library", "No Photo Taken");
              image.defer.reject("Camera Not Available");
          };

          image.takePhoto1 = function(index) {
              var q = $q.defer();
              var options = {
                  quality: 100,
                  destinationType: Camera.DestinationType.DATA_URL,
                  sourceType: index,
                  encodingType: Camera.EncodingType.JPEG,
                  targetWidth: 1024,
                  targetHeight: 1024,
                  popoverOptions: CameraPopoverOptions,
                  saveToPhotoAlbum: true,
                  correctOrientation: true
              }
              image.takePhoto(index, options).then(function(blob) {
                  $ionicLoading.show({ template: 'Preparing' })
                  q.resolve(blob);
              }, function(err) {
                  console.log(err)
                  $ionicLoading.hide();
                  q.reject(err);
              });
              return q.promise;
          };

          image.saveTOdb = function() {
              $cordovaFile.writeFile(cordova.file.externalDataDirectory, 'new_pic.jpg', image.finalBlob, true)
                  .then(function(success) {
                  }, function(error) {
                      alert("errore nella creazione del report")
                  });
          }



          return image;
      };
  })();
