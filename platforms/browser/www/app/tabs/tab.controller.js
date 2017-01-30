(function() {
    'use strict';
    angular.module('hash').controller('tabCtrl', tabCtrl);

    function tabCtrl(localStorageService, tost, $ionicActionSheet,Gallery, $localStorage, $state, Image1, $ionicModal, $scope, $ionicLoading) {
        var self = this;
        self.capture = function() {
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
                      if(index == 1){
                          Image1.takePhoto1().then(function(res) {
                            $state.go('viewphoto');
                        });
                      }else{
                        Gallery.getPics().then(function(res){
                           $state.go('viewphoto');
                        }, function(err){
                            console.log(err)
                        });
                      }
 
                        return true;
                    }
                });

            } else {
                tost.notify('Title and Hashtag should not be left empty', 'top');
            }
            $scope.go = function() {
                $state.go('tab.dash')
            }
            $scope.onTabSelected = function() {
                $localStorage.$reset();
            }
        }
    }
})();
