var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_mvjbw9sw:a4lf8et48lhrmeefas5n3oqtcm@ds137760.mlab.com:37760/heroku_mvjbw9sw');

var db = mongoose.connection;

db.on('error', function(err) {
    console.log('connection error', err);
});
db.once('open', function() {
    console.log('connected.');
});

var positionSchema = mongoose.Schema({
    device_id: String,
    lat: String,
    lng: String,
    accuracy: String,
    bearing: String,
    speed: String,
    altitude: String,
    time: String,
    mg_code: String,
    status: String,
    customer_id: String,
    created_at: String,
    booking_id: String,
    updated_at: String
});

var position = mongoose.model('Positions', positionSchema);
app.use('/static', express.static('public/js'));

function updateLatLng(data) {
    var dateString = new Date,
        dformat = [dateString.getMonth() + 1, dateString.getDate(), dateString.getFullYear()].join('/') + ' ' + [dateString.getHours(), dateString.getMinutes(), dateString.getSeconds()].join(':');
    position.find({ 'device_id': data.device_id }, function(err, docs) {
        console.log(docs.length);
        if (docs.length > 0) {
            position.update({ device_id: data.device_id }, { $set: { lat: data.lat, lng: data.lng, accuracy: data.accuracy, bearing: data.bearing, speed: data.speed, altitude: data.altitude, time: data.time, mg_code: data.mg_code, status: data.status, customer_id: data.customer_id, created_at: dateString, booking_id: data.booking_id, updated_at: dateString } }, function(err, doc) {

            });
        } else {
            result = new position({ device_id: data.device_id, lat: data.lat, lng: data.lng, accuracy: data.accuracy, bearing: data.bearing, speed: data.speed, altitude: data.altitude, time: data.time, mg_code: data.mg_code, status: data.status, customer_id: data.customer_id, created_at: dateString, booking_id: data.booking_id, updated_at: dateString });
            result.save(function(err, data) {
                if (err) console.log(err);
                else console.log('Saved : ', data);
            });
        }
    });
}

io.sockets.on('connection', function(socket) {
    var id = socket.id;
    console.log('one user connected ' + socket.id);
    socket.on('message', function(data) {
        socket.emit('message', { message: data });
    });

    socket.on('position', function(data) {
        socket.emit('position', { position: data });
        console.log('Position Update');
        updateLatLng(data);
        position.find({}, function(err, docs) {
            socket.emit('free_driver', { free_driver: docs });
            socket.broadcast.emit('free_driver', { free_driver: docs });
        });
    });

    io.sockets.on('connection', function(socket) {
        socket.on('door', function(data) {
            var result1 = socket.broadcast.emit('message', { message: data });
            var result2 = socket.broadcast.to(id).emit('position', { postion: data });
        });
    });

    socket.on('disconnect', function(data) {
        console.log("Connection Lost id " + id);
    });
});

app.get('/getDriver', function(req, res) {
    var date = new Date();
    var lastDate = new Date(date.getTime() - 3 * 60000);
    position.find({ created_at: { $gt: lastDate } }, function(err, docs) {
        res.send(docs);
    });
});


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});


function doorClicked() {
    socket.emit('door');
}

http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:3000');
});
