var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');



app.use('/static', express.static('public'));

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");


    db.createCollection('position', { size: 2147483648 });

    var collection = db.collection('position');



    function updateLatLng(data) {
        console.log('position update');
        db.collection('positions').insert({ lat: data.lat, lng: data.lng, status: data.status, device_id: data.device_id });
        // initialize(data);
    }

    function getName(device) {

    }

    io.sockets.on('connection', function(socket) {
        var id = socket.id;
        console.log('one user connected ' + socket.id);
        socket.on('message', function(data) {
            socket.emit('message', { message: data });
        });

        socket.on('position', function(data) {
            socket.emit('position', { position: data });
            updateLatLng(data);
        });

        io.sockets.on('connection', function(socket) {
            socket.on('door', function(data) {
                var result1 = socket.broadcast.to(id).emit('message', { message: data });
                var result2 = socket.broadcast.to(id).emit('position', { postion: data });
            });
        });

        socket.on('disconnect', function(data) {
            console.log("Connection Lost id " + id);
        });
    });




    app.get('/getDriver', function(req, res) {
        var device = req.param('driver_device_id');
        var data = db.collection('positions').find({ device_id: device }).toArray(function(err, docs) {
            console.log(docs);
            res.send(docs);
        });
    });



});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


function doorClicked() {
    socket.emit('door');
}

http.listen(3000, function() {
    console.log('listening on *:3000');
});
