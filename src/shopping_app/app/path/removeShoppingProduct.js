var shoppingconf = require('../shoppingconf');

function handler(req, res){
 console.log("POST /shopping/remove/" + req.params.shopping_id + "/product/" + req.params.product_id);

 var shopping_id = req.params.shopping_id;
 var product_id = req.params.product_id;

 shoppingconf.removeShoppingProduct(shopping_id, product_id, function(err, ret){
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

