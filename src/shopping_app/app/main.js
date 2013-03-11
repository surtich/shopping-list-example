#!/usr/bin/env node
var commons = require('../../lib/commons'),
hero	= commons.hero,
app = hero.app,
shoppingconf = require('./shoppingconf.js');

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

