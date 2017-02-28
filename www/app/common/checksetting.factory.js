(function() {
    'use strict';
    angular.module('hash').factory("CheckSetting", CheckSetting);

    function CheckSetting(localStorageService, configuration) {
        var service = {};
        service.CheckDefault = function() {
            var setting = localStorageService.get('setting');
            if (!setting)
                this.SetDefault();
        }

        service.SetDefault = function() {
            localStorageService.set('setting', {
                sharingPlatform: "All",
                hashtagColor: "#ffffff",
                hashtagShadow: true,
                shadowColor: "#000000",
                keepHistory: true,
                keepUnusedMedia: true,
                keepUntaggedMedia: true,
                IsSignature: false
            });
        }


        service.AddNewSuggestion = function(data) {
            var elem = { title: data.title, hash: data.hash };
            var array = localStorageService.get('HashSuggestions');
            var decide = 0;
            for (var i = 0; i < array.length; i++) {
                if (array[i].title == elem.title && array[i].hash == elem.hash) {
                    decide = 1;
                    return i;
                }
            }

            if (decide === 0 && data.title && data.hash) {
                array.push(elem);   
                localStorageService.set('HashSuggestions', array);
            }
        }

        return service;
    }
})();
