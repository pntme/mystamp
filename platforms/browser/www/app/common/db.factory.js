(function() {
    'use strict';
    angular.module('hash').factory('db', db);

    function db($q, localStorageService) {
        var f = {};
        var db;
        var self = this;
        f.CreateDb = function() {
            db = null;
            db = window.sqlitePlugin.openDatabase({ name: 'history.db', location: 'default' });
            db.transaction(function(tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS records (title, tweet, image, date)');
            }, function(error) {
                console.log('Transaction ERROR: ' + error.message);
            }, function() {
                console.log('Populated database OK');
            });
        }

        f.InsertDb = function(title, tweet, image) {
            var date = new Date().valueOf()
            db.transaction(function(tx) {
                tx.executeSql('INSERT INTO records (title, tweet, image, date) VALUES (?, ?, ?, ?)', [title, tweet, image, date]);
            }, function(error) {
                console.log('error', error);
            }, function() {
                console.log('insertion done');
            });
        }

        f.GetData = function() {
            var defer = $q.defer();
            var finalData = [];
            db.executeSql('SELECT * FROM records', [], function(rs) {
                for (var i = 0; i < rs.rows.length; i++) {
                    var obj = {
                        'title': rs.rows.item(i).title,
                        'tweet': rs.rows.item(i).tweet,
                        'image': rs.rows.item(i).image,
                        'date': rs.rows.item(i).date
                    }
                    finalData.push(obj);
                }
                localStorageService.set('Storage', finalData);
                console.log(finalData)
                defer.resolve(finalData);
            }, function(error) {
                console.log('SELECT SQL statement ERROR: ' + error.message);
                defer.reject(error);
            });

            return defer.promise;
        }

        f.GetDataById = function(_id) {
            var dataByid = localStorageService.get('Storage');
            for (var i = 0; i < dataByid.length; i++) {
                if (dataByid[i].date == _id) {
                    return dataByid[i];
                }
            }
        }

        f.deleteData = function(data) {
            db.executeSql('DELETE FROM records WHERE date = ?', [data], function(rs) {
              console.log(rs)
            }, function(error) {
                console.log('SELECT SQL statement ERROR: ' + error.message);

            });
        }

        f.deleteFile = function(file) {
            var path = cordova.file.externalDataDirectory;
            var filename = file.replace(path, '');
            console.log(path)
            console.log(filename)
            window.resolveLocalFileSystemURL(path, function(dir) {
                dir.getFile(filename, { create: false }, function(fileEntry) {
                    fileEntry.remove(function() {
                        console.log('succcess')
                            // The file has been removed succesfully
                    }, function(error) {
                        console.log(error)
                            // Error deleting the file
                    }, function() {
                        // The file doesn't exist
                    });
                });
            });

        }
        return f;
    }
})();
