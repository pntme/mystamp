(function() {
    'use strict';
    angular.module('hash').controller('historyCtrl', historyCtrl);

    function historyCtrl($scope, localStorageService, db) {
        var self = this;
        function StartFeteching() {
            var Storage = localStorageService.get('Storage');
            db.GetData().then(function(res) {
                $scope.chats = res;
            });
        }

        $scope.remove = function(data, order) {
            console.log(data)
            db.deleteData(data.date);
            db.deleteFile(data.image);
            $scope.chats.splice(order, 1);
            
        }
        StartFeteching();
    }
})();
