var express = require('express'),
mongoose = require('mongoose'),
http = require('http'),
app = express(),
passport = require('passport');

var URI_CONNECTION = "mongodb://shopping-list-database-user:shopping-user-23ewejfoiejfe@linus.mongohq.com:10077/shopping-list-database";
var PORT = 8081;

app.configure(function(){
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
http.createServer(app).listen(PORT);

