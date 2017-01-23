(function(){
'use strict'
angular.module('hash').controller('homeCtrl', homeCtrl);
function homeCtrl(localStorageService, db, $localStorage, $state, tost, $scope,  $timeout, $rootScope, $ionicLoading){
	var self = this;
	 $rootScope.showcamera = false;
    var setting = localStorageService.get('setting');
    if(setting){
    	self.hash = setting.hash;
    	self.title = setting.title;
    }

	self.done = function(){
		// db.InsertDb('hii', 'hello');
		localStorageService.set('setting', {
			hash: self.hash,
			title: self.title
		});
		tost.notify('Setting saved', 'top');
	}

	self.logout = function(){
		db.GetData();
	}
}
})();