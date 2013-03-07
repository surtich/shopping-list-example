#!/usr/bin/env node
var commons = require('../../lib/commons'),
express = commons.express,
mongoose = commons.mongoose,
http = commons.http,
passport = commons.passport,
hero	= commons.hero,
app = hero.app,
shoppingconf = require('./shoppingconf.js'),
port = shoppingconf.config.app.port,
url  = shoppingconf.config.app.url + ":" + port + '/';

//var URI_CONNECTION = "mongodb://shopping-list-database-user:shopping-user-23ewejfoiejfe@linus.mongohq.com:10077/shopping-list-database";
//var URI_CONNECTION = hero.config().app.db;

/* We can access nodejitsu enviroment variables from process.env */
/* Note: the SUBDOMAIN variable will always be defined for a nodejitsu app */
if(process.env.SUBDOMAIN){
 url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}

app.configure(function(){
 app.set('port', process.env.PORT || port);
 app.set('url', url);
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
 app.use(express["static"](__dirname + "/../www"));
});

app.configure('development', function(){
 app.use(express.errorHandler());
});

/*
routes = require('./routes/oauth')(app, passport);
routes = require('./routes/secure')(app);
routes = require('./routes/category')(app);
routes = require('./routes/product')(app);
routes = require('./routes/list')(app);
*/
//Connect to the MongoDB test database
//mongoose.connect(URI_CONNECTION);

//Start the server
//http.createServer(app).listen(app.get('port'), function(){
 //console.log("Shopping List server listening on port " + app.get('port'));
//console.log(url);
//});


hero.init(
 require("./paths.js").paths,

 function (){
  shoppingconf.ready(function(err){
   if(err) {
    hero.error(err);
   } else {
    app.listen(port);
    console.log('listening on port ' + port);
   }
  });
 }
 );

