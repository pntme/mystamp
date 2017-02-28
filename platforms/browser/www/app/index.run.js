(function() {
        angular.module('hash')
            .run(function($ionicPlatform, db, createfolder) {
                    $ionicPlatform.ready(function() {
                            createfolder.create();
                            db.CreateDb();
                            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                                cordova.plugins.Keyboard.disableScroll(true);
                            }
                            if (window.StatusBar) {
                                // org.apache.cordova.statusbar required
                                StatusBar.styleDefault();
                            }

                            document.addEventListener('deviceReady', function() {
                                    window.plugins.intent.getCordovaIntent(function(Intent) {
                                        console.log(Intent);
                                    }, function() {
                                        console.log('Error');
                                    });
                                }
                            });
                    })
            })();
