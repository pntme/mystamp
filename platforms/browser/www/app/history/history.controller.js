(function(){
'use strict';
angular.module('hash').controller('historyCtrl', historyCtrl);
function historyCtrl($scope,localStorageService, db){
	var self = this;
	var Storage = localStorageService.get('Storage');
	db.GetData().then(function(res){
		$scope.chats = res; 
	});
   
}
})();