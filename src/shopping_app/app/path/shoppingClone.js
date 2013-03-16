var shoppingconf = require('../shoppingconf');

function handler(req, res, next){
 console.log("POST /shopping/clone/:shopping_id");

 shoppingconf.cloneShoppingList(req.params.shopping_id, function(err, shoppingList){
  if(err){
   res.send(400, {
    err : 'Error when cloning list'
   });
  } else {
   res.send(200, shoppingList);
  }
 });
 
}
module.exports = handler;

