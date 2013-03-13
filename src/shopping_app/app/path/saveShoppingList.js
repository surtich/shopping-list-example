var shoppingconf = require('../shoppingconf');

function handler(req, res){
 debugger
 console.log("POST /shopping/save");
 shoppingconf.saveShoppingList(req.body.products, req.user.email, function(err, shoppingList){
  if(err){
   res.send(400, {
    err : 'Error when creating list'
   });
  } else {
   res.send(200, shoppingList);
  }
 });
 
}

module.exports = handler;

