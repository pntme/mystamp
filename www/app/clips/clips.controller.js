(function() {
    'use strict';
    angular.module('hash').controller('clipCtrl', clipCtrl);

    function clipCtrl($cordovaFile, Image1, createfolder, tost) {
        var self = this;
        self.width = window.innerWidth - 20;
        self.selectedLineWidth = 10;
        self.undo = function() {
            self.version--;
        };

        self.save = function() {
            var canvas = document.getElementById("pwCanvasMain");
            var imgURI = canvas.toDataURL();
            imgURI = imgURI.replace(/^data:image\/[a-z]+;base64,/, "");
            var blob = Image1.baseUpload(imgURI);
            var name = new Date().valueOf() + '.png';
            createfolder.savePicture(name, blob).then(function(data) {
                tost.notify('Your signature is saved', 'center');
                self.version = 0;
            }, function(err) {
                console.log(err);
            });

        }
    }
})();
