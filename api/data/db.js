var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/meanhotel';
//27017
mongoose.connect(dburl);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dburl);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error ' + err);
});

//
 if (process.platform === "win32") {
        console.log('Yes we\'re windows!\' '); 
        var rl = require("readline").createInterface({
         input: process.stdin,
         output: process.stdout
        });

         rl.on("SIGINT", function () {
         process.emit("SIGINT");
        });

        rl.on("SIGTERM", function () {
         process.emit("SIGTERM");
        });

        rl.on("SIGUSR2", function () {
         process.emit("SIGUSR2");
         console.log('emitters done');
        });
 }

//processes
process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        
        console.log('Mongoose terminated by SIGINT');
        process.exit(0);
    });
});

process.on('SIGTERM', function() {
    mongoose.connection.close(function() {
        
        console.log('Mongoose terminated by SIGTERM');
        process.exit(0);
    });
});

process.once('SIGUSR2', function() {
    mongoose.connection.close(function() {
        
        console.log('Mongoose terminated by SIGUSR2');
        process.kill(process.pid, 'SIGUSR2');
    });
});

//Schemas and models

require('./hotels.model');

require('./users.model');