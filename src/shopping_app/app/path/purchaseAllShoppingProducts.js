var shoppingconf = require('../shoppingconf');

function handler(req, res){
 console.log("PUT /shopping/purchase/" + req.params.shopping_id + "/purchased/" + req.params.purchased);

 var shopping_id = req.params.shopping_id;
 var purchased = req.params.purchased;

 shoppingconf.purchaseAllProducts(shopping_id, purchased, function(err, ret){
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
