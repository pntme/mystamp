(function() {
    'use strict';
    angular.module('hash').factory('db', db);
    function db($q) {
        var f = {};
        var db;
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
            var date =  new Date().valueOf()
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
                        'date' : rs.rows.item(i).date
                    }
                    finalData.push(obj);
                }
             defer.resolve(finalData);
            }, function(error) {
                console.log('SELECT SQL statement ERROR: ' + error.message);
                defer.reject(error);
            });

            return defer.promise;
        }


        return f;
    }
})();
