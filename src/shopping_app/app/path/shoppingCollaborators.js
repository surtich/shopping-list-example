var shoppingconf = require('../shoppingconf');

function handler(req, res, next){
 console.log("GET /shopping/collaborators/:shopping_id");

 shoppingconf.getShoppingCollaborators(req.params.shopping_id, function(err, collaborators){
  if(err) {
   res.send(400, {err: "error"});
  } else {
   res.send(collaborators);
  }
	});
 
}

module.exports = handler;

