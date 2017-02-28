(function(){
'use strict';
angular.module('hash').controller('detailCtrl', detailCtrl)
function detailCtrl($scope, Chats, $stateParams){
	var self = this;
	$scope.chat = Chats.get($stateParams.chatId);
}
})();