(function() {
    angular.module('hash')
        .run(function($ionicPlatform, db, createfolder, localStorageService) {
            $ionicPlatform.ready(function() {
                createfolder.create("Mystamp");
                createfolder.create("Stamps");
                db.CreateDb();
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
             
                var HashSuggestions = localStorageService.get('HashSuggestions');
                if(!HashSuggestions)               
                    localStorageService.set('HashSuggestions',[{title: 'MyStamp', hash: 'TakenByMyStamp' }]);
            });
        });
})();
