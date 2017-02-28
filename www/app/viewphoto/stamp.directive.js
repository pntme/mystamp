(function() {
    'use strict';
    angular.module('hash').directive('stamp', stamp);

    function stamp() {
        return {
            restrict: 'E',
            template: "<button class='button button-small stamp-button' ng-click='OpenStamps()'>Stamp</button>",
            controller: function($timeout, createfolder, Image1, $scope, $ionicModal, CaptureStamp, db, $q, $state, $ionicLoading) {

                $scope.OpenStamps = function() {
                    db.getAllClips("file:///storage/emulated/0/Stamps/").then(function(res) {
                        if (res.length == 0) {
                            $scope.CaptureStamps().then(function() {
                                $scope.OpenStamps();
                            });
                        } else {
                            OpenModal(res);
                        }
                    });
                }


                function OpenModal(data) {
                    $ionicModal.fromTemplateUrl("app/viewphoto/stamppics.html", {
                        scope: $scope
                    }).then(function(modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                        $scope.Stamps_Pics = data;

                    });

                }

                $scope.CaptureStamps = function() {
                    $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner> Working' });
                    if ($scope.modal)
                        $scope.modal.hide();
                    $scope.myCroppedImage = '';
                    var q = $q.defer();
                    CaptureStamp.Capture().then(function(res) {
                        $ionicModal.fromTemplateUrl("app/viewphoto/crop.html", {
                            scope: $scope
                        }).then(function(modal) {
                            $scope.myImage = CaptureStamp.CapturedStamp;
                            $scope.Cropmodal = modal;
                            $scope.Cropmodal.show();
                            $timeout(function() {
                                $ionicLoading.hide();
                            }, 200);

                        });
                    })
                    return q.promise;
                }

                $scope.Select = function(data) {
                    $ionicLoading.show({ template: 'Working' });
                    $scope.$emit('StampSelected', {
                        data: data.nativeURL
                    });
                    $scope.modal.hide();
                }


                $scope.done = function() {
                    $ionicLoading.show({ template: '<ion-spinner icon="crescent"></ion-spinner> Saving' });
                    var imgURI = document.getElementById('result').src;
                    imgURI = imgURI.replace(/^data:image\/[a-z]+;base64,/, "");
                    var blob = Image1.baseUpload(imgURI);
                    var name = new Date().valueOf() + '.png';
                    var location = 'file:///storage/emulated/0/Stamps/';
                    createfolder.savePicture(name, blob, location).then(function(res) {
                        $scope.Cropmodal.hide();
                        $scope.Cropmodal.remove();
                        $ionicLoading.hide();
                        $scope.OpenStamps();
                    });
                }

            }
        }
    }
})();
