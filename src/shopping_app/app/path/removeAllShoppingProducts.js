var shoppingconf = require('../shoppingconf');

function handler(req, res){
 console.log("DELETE /shopping/remove/" + req.params.shopping_id);

 var shopping_id = req.params.shopping_id;

 shoppingconf.removeAllShoppingProducts(shopping_id, function(err, ret){
  if(err || ret === 0){
   res.send(400, {
    err : 'not found'
   });
  } else {
   res.send(200, {});
  }
 });
}

module.exports = handler;