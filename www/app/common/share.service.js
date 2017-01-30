(function() {
    'use strict';
    angular.module('hash').factory('ShareService', ShareService);

    function ShareService( $cordovaSocialSharing) {
        var service = {};
        var self = this;
        service.share = function(decide, description, pictures) {
            switch (decide) {
                case 0:
                    this.ViaTwitter(description, pictures);
                    break;
                case 1:
                    this.ViaInstagram(description, pictures);
                    break;
                case 2:
                    this.ViaFacebook(description, pictures);
                    break;
                case 3:
                    this.SaveData(description, pictures);
                    break;
            }
        };

        service.ViaTwitter = function(description, pictures) {
        	  $cordovaSocialSharing
                        .shareViaTwitter(description, pictures)
                        .then(function(result) {
                            console.log(result)
                        }, function(err) {
                            console.log(err)

                        });

        }

        service.ViaInstagram = function(description, pictures) {
            console.log('insta')
        }

        service.ViaFacebook = function(description, pictures) {
            console.log('fb')
        }

        service.SaveData = function(description, pictures) {
            console.log('data');
        }

        service.OnError = function(error) {
            console.log('error', error)
        }

        service.OnSuccess = function() {
            console.log('success');
        }
        return service;
    }
})();
