#!/usr/bin/env node

var express = require('express'),
mongoose = require('mongoose'),
http = require('http'),
app = express(),
passport = require('passport'),
port = 8080,
url  = 'http://localhost:' + port + '/';

var URI_CONNECTION = "mongodb://shopping-list-database-user:shopping-user-23ewejfoiejfe@linus.mongohq.com:10077/shopping-list-database";


/* We can access nodejitsu enviroment variables from process.env */
/* Note: the SUBDOMAIN variable will always be defined for a nodejitsu app */
if(process.env.SUBDOMAIN){
  url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}

app.configure(function(){
    app.set('port', process.env.PORT || port);
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({
        secret: 'keyboard cat'
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express["static"](__dirname + "/client_files"));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});


routes = require('./node_files/routes/oauth')(app, passport);
routes = require('./node_files/routes/secure')(app);
routes = require('./node_files/routes/category')(app);
routes = require('./node_files/routes/product')(app);
routes = require('./node_files/routes/list')(app);

//Connect to the MongoDB test database
mongoose.connect(URI_CONNECTION);

//Start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Shopping List server listening on port " + app.get('port'));
  console.log(url);
});

