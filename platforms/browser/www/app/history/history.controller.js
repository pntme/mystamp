(function() {
    'use strict';
    angular.module('hash').controller('historyCtrl', historyCtrl);

    function historyCtrl($scope, localStorageService, $ionicListDelegate, db, $state) {
        var self = this;

        function StartFeteching() {
            var Storage = localStorageService.get('Storage');
            db.GetData().then(function(res) {
                console.log(res)
                $scope.items = res;

            });
        }
        StartFeteching();
        $scope.delItem = function(item) {
            db.deleteData(item.date);
            $scope.items.splice($scope.items.indexOf(item), 1);
            $ionicListDelegate.closeOptionButtons();
        };

    }
})();
