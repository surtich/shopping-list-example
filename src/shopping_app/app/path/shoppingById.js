var shoppingconf = require('../shoppingconf');

function handler(req, res, next){
 console.log("GET /shopping/:shopping_id");

 shoppingconf.getShoppingList(req.params.shopping_id, function(err, shopping){
  if(err) {
   res.send(400, {err: "error"});
  } else {
   res.send(shopping);
  }
	});
 
}

module.exports = handler;

