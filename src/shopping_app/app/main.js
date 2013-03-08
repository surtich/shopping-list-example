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



hero.init(
 require("./paths.js").paths,

 function (){
  shoppingconf.ready(function(err){
   if(err) {
    hero.error(err);
   } else {
    app.listen(app.get('port'));
    console.log('listening on port ' + app.get('port'));
   }
  });
 }
 );

