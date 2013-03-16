var shoppingconf = require('../shoppingconf');

function handler(req, res, next){
 console.log("DELETE /shopping/:shopping_id");

 shoppingconf.removeShoppingList(req.params.shopping_id, function(err, ret){
  if(err) {
   res.send(400, {
    err: "error"
   });
  } else if (!ret) {
   res.send(400, {
    err: "Not found"
   });
  } else {
   res.send(200, {});
  }
 });
 
}

module.exports = handler;

