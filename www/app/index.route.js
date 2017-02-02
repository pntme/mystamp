(function() {
    'use strict';
    angular.module('hash')
        .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


            $ionicConfigProvider.tabs.position('bottom');
            $stateProvider

            // setup an abstract state for the tabs directive


                .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'app/tabs/tab.html',
                controller: 'tabCtrl',
                controllerAs: 'tab'
            })

            // Each tab has its own nav history stack:

            .state('tab.dash', {
                    url: '/dash',
                    views: {
                        'tab-dash': {
                            templateUrl: 'app/home/home.html',
                            controller: 'homeCtrl',
                            controllerAs: 'home',
                            cache: false
                        }
                    }
                })
                .state('viewphoto', {
                    url: '/viewphoto/:id',
                    templateUrl: 'app/viewphoto/viewphoto.html',
                    controller: 'viewPhotoCtrl',
                    controllerAs: 'view',
                    cache: false
                })

            .state('tab.chats', {
                    url: '/chats',
                    cache: false,
                    views: {
                        'tab-chats': {
                            templateUrl: 'app/history/history.html',
                            controller: 'historyCtrl'
                        }
                    }
                })
                .state('tab.clips', {
                    url: '/clips',
                    cache: false,
                    views: {
                        'tab-clips': {
                            templateUrl: 'app/clips/clips.html',
                            controller: 'clipCtrl',
                            controllerAs: 'clip'
                        }
                    }
                })
                .state('tab.chat-detail', {
                    url: '/chats/:chatId',
                    views: {
                        'tab-chats': {
                            templateUrl: 'app/history/detail.html',
                            controller: 'detailCtrl'
                        }
                    }
                });

            $urlRouterProvider.otherwise('/tab/dash');

            // if none of the above states are matched, use this as the fallback
            // $urlRouterProvider.otherwise(function($injector, $location) {
            //          var $state = $injector.get("$state");
            //          $state.go('login');
            //      });

        });

})();
