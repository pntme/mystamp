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
                shadowColor: "#ff0000",
                keepHistory: true,
                keepUnusedMedia: true,
                keepUntaggedMedia: true
            });
        }

        return service;
    }
})();
