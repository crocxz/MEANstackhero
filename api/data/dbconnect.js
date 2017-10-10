var MongoClient = require('mongodb').MongoClient;

//protocol, server, database
var dburl = 'mongodb://localhost:27017/meanhotel';


var_connection = null;

//open connection
var open = function() {
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            console.log("DB connection failed!");
            return;
        }
        _connection = db;
        console.log("DB connection open", db);

    });
    //set _connection
};

//retrieve data
var get = function() {
    return _connection;
}

module.exports = {
    open : open,
    get : get
};