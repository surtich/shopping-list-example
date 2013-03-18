var shoppingconf = require('../shoppingconf');

function handler(req, res){
 console.log("POST /shopping/add/" + req.params.shopping_id + "/collaborator/" + req.params.email);

 var shopping_id = req.params.shopping_id;
 var email = req.params.email;

 shoppingconf.addShoppingCollaborator(shopping_id, email, function(err, ret){
  if(err){
   res.send(400, {
    err : 'Not Found'
   });
  } else {
   res.send(200, {ret: ret});
  }
 });
}

module.exports = handler;

