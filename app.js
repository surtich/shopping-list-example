var express = require('express'),
mongoose = require('mongoose'),
http = require('http');
var OAuth= require('oauth').OAuth;

var app = express();


var oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    "iJD3B6C3gHBVO5TYI32j8Q",
    "Li9M2bATTKBmCSPUPSP2IyjZdEpbbzWSgyc13Hx6oa0",
    "1.0",
    "http://127.0.0.1:8081/auth/twitter/callback",
    "HMAC-SHA1"
    );


app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    var store = new express.session.MemoryStore;
    app.use(express.session({ secret: 'whatever', store: store }));
    app.use(app.router);
    app.use(express.static(__dirname + "/client_files"));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

routes = require('./node_files/routes/secure')(app);
routes = require('./node_files/routes/category')(app);
routes = require('./node_files/routes/product')(app);
routes = require('./node_files/routes/oauth')(app, oa);

//Connect to the MongoDB test database
mongoose.connect('mongodb://localhost/shopping-list-database');

//Start the server
http.createServer(app).listen(8081);