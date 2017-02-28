(function() {
    'use strict';
    angular.module('hash').directive('header', header);

    function header() {
        return {
            restrict: 'E',
            template: `<ion-nav-bar class="bar bar-header bar-calm-900">
           <div class="h1  title-left light">My Stamp</div>
             <ion-nav-title>
         My Stamp
    </ion-nav-title>
            <ion-nav-buttons side="right">
                <button class="button button-fab ink-dark button-calm icon" id="menu-popover" data-ink-color="#ff0000" data-ink-opacity=".8"  ng-click="capture();">
                 <img src="assest/img/camera1.png" style="width: 58%;
    margin-top: 9px;"></button>
            </ion-nav-buttons>
        </ion-nav-bar>`,
            controller: function(localStorageService, tost, $ionicPopover, $ionicActionSheet, $localStorage, $state, Image1, $ionicModal, $scope, $ionicLoading) {
                var template = `<ion-popover-view style="height: 96px;">
                       <ion-content scroll='false' style="margin: 0px;">
                          <button class="button action-sheet-option Pop" style="width:100%;" ng-click="closePopover(); capture();"><p class="text-start"><i class="ion-images"></i> Picture </p></button>
                           <button class="button action-sheet-option Pop" style="width:100%;" ng-click="closePopover(); capture();"><p class="text-start"><i class="ion-android-image"></i> GIF</p></button>
                       </ion-content>
                    </ion-popover-view>`;

                $scope.popover = $ionicPopover.fromTemplate(template, {
                    scope: $scope
                });
                $scope.closePopover = function() {
                    $scope.popover.hide();
                };

                $scope.capture = function() {
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
                                Image1.takePhoto1(index).then(function(res) {
                                    $state.go('viewphoto');
                                });
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
