(function() {
    'use strict';
    angular.module('hash').controller('historyCtrl', historyCtrl);

    function historyCtrl($scope, localStorageService, db, $state) {
        var self = this;
        $scope.$on('SelectedData', function(event, data) {
            $state.go('viewphoto', {
                id: data.id
            });
        });

        function StartFeteching() {
            var Storage = localStorageService.get('Storage');
            db.GetData().then(function(res) {
                console.log(res)
                $scope.items = res;

            });
        }


        $scope.$on("SelectedDataRemove", function(event, data) {
            console.log(data)
            db.deleteData(data.date);
            db.deleteFile(data.src);
            StartFeteching();
        });


        StartFeteching();




    }
})();
