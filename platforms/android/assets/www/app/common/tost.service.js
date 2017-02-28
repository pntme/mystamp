 (function() {
    'use strict';
    angular.module('hash')
            .factory('tost', tost);

    function tost() {
        return {
            notify: function(message, position) {
              if(window.plugins && window.plugins.toast){
                ///then execute ur code
                window.plugins.toast.showWithOptions(
                    {
                      message: message,
                      duration: "short",
                      position: "center"
                    }
                  );
                }else{
                // this means on browser simply alert the message
                alert(message);
                }
            }
        }
    };

})();