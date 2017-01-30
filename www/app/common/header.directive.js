(function() {
    'use strict';
    angular.module('hash').directive('header', header);

    function header() {
        return {
            restrict: 'E',
            template: `<div class="bar bar-header bar-calm-900" >
                <div class="h1 title title-left light">My Stamp</div>
                <div class="buttons buttons-right header-item">
                    <span class="right-buttons">
                        <button class="button button-fab ink-dark button-calm icon" data-ink-color="#ff0000" data-ink-opacity=".8" ng-click="capture();">  <img src="assest/img/camera1.png" style="width: 58%;
    margin-top: 9px;"></button>
                    </span>
                </div>
            </div>`,
            controller: function(localStorageService, tost, $ionicActionSheet, Gallery, $localStorage, $state, Image1, $ionicModal, $scope, $ionicLoading) {
                $scope.capture = function() {
                    Image1.finalBlob = '';
                    Gallery.pics = '';
                    var setting = localStorageService.get('setting');
                    if (setting && setting.title && setting.hash) {
                        var hideSheet = $ionicActionSheet.show({
                            buttons: [{
                                text: '<p class="text-center"><i class="ion-images"></i> Gallery</p>'
                            }, {
                                text: '<p class="text-center"><i class="ion-camera"></i> Camera</p>'
                            }],
                            cancelText: 'Cancel',
                            cancel: function() {},
                            buttonClicked: function(index) {
                                if (index == 1) {
                                    Image1.takePhoto1().then(function(res) {
                                        $state.go('viewphoto');
                                    });
                                } else {
                                    Gallery.getPics().then(function(res) {
                                        $state.go('viewphoto');
                                    }, function(err) {
                                        console.log(err)
                                    });
                                }

                                return true;
                            }
                        });

                    } else {
                        tost.notify('Title and Hashtag should not be left empty', 'top');
                    }
                }
            }
        }
    }
})();
