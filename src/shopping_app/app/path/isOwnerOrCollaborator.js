var shoppingconf = require('../shoppingconf');

function handler(req, res, next){
 var session_email = req.user.email;
 var shopping_id = req.params.shopping_id;
 
 shoppingconf.checkOwner(shopping_id, session_email, function(err, ret){
  if(err){
   res.send(400, {
    err : 'Error'
   });
  } else if (ret === true){
   next();
  } else {
   shoppingconf.isCollaborator(req.params.shopping_id, session_email, function(err, result){
    if(err) {
     res.send(400, {
      err: "error"
     });
    } else {
     if (!result) {
      res.send(403, {
       err: "You must be the owner or a collaborator"
      });
     } else {
      next();
     }
    }
   });  
  }
 });
}

module.exports = handler;

