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
              var name =  new Date().valueOf() + '.png';
              var binary = image.fixBinary(atob(imageBase64));
              var blob = new Blob([binary], { type: 'image/png', name: name });
              blob.name = name;
              blob.$ngfName = name;
              image.finalBlob = blob;
              return blob;
          };

          image.defer = '';
          image.takePhoto = function(index) {
              image.defer = $q.defer();
              try {
                  var options = {
                      "destinationType": Camera.DestinationType.DATA_URL,
                      "sourceType": index
                  };
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
              beersHelper.alert("Upload Image From Your Device Library", "No Photo Taken");
              image.defer.reject("Camera Not Available");
          };

          image.takePhoto1 = function(title) {
              var q = $q.defer();
              var options = {
                  quality: 75,
                  destinationType: Camera.DestinationType.DATA_URL,
                  sourceType: Camera.PictureSourceType.CAMERA,
                  allowEdit: true,
                  encodingType: Camera.EncodingType.JPEG,
                  targetWidth: 100,
                  targetHeight: 100,
                  popoverOptions: CameraPopoverOptions,
                  saveToPhotoAlbum: false
              }
              image.takePhoto(1).then(function(blob) {
                  q.resolve(blob);
              }, function(err) {
                  $ionicLoading.hide();
                  q.reject(err);
              });
              return q.promise;
          };

          image.saveTOdb = function() {
              console.log('started')
              $cordovaFile.writeFile(cordova.file.externalDataDirectory, 'new_pic.jpg', image.finalBlob, true)
                  .then(function(success) {
                      console.log(success)
                  }, function(error) {
                      alert("errore nella creazione del report")
                  });
          }



          return image;
      };
  })();
