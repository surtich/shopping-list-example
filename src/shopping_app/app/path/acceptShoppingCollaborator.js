var shoppingconf = require('../shoppingconf');

function handler(req, res){
 console.log("PUT /shopping/accept/" + req.params.shopping_id + "/collaborator/" + req.params.product_id);

 var shopping_id = req.params.shopping_id;
 var email = req.params.email;

 shoppingconf.acceptCollaborator(shopping_id, email, function(err, ret){
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
