var express = require('express')
, mongoose = require('mongoose')
, http = require('http')
, passport = require('passport')
, util = require('util')
, GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
, app = express();



app.configure(function(){
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({
        secret: 'keyboard cat'
    }));
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + "/client_files"));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});


routes = require('./node_files/routes/oauth')(app, passport, GoogleStrategy);
routes = require('./node_files/routes/secure')(app);
routes = require('./node_files/routes/category')(app);
routes = require('./node_files/routes/product')(app);
//routes = require('./node_files/routes/oauth')(app, oa);

//Connect to the MongoDB test database
mongoose.connect('mongodb://localhost/shopping-list-database');

//Start the server
http.createServer(app).listen(8081);

