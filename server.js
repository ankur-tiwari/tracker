/*// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var path           = require('path');
var compression	   = require('compression');

// configuration ===========================================
	
// config files
var db = require('./config/db');

var port = process.env.PORT || 8080; // set our port
mongoose.connect(db.url, function (err) {
	if (err) console.log(err)
}); // connect to our mongoDB database (commented out after you enter in your own credentials)

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

app.use(compression());
// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.set('views', path.join(__dirname, '/views')); // Convenience since it's the fault anyway.
app.set('view engine', 'jade');

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app*/


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
