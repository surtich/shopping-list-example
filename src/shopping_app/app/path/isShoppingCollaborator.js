var shoppingconf = require('../shoppingconf');

function handler(req, res, next){
 var session_email = req.user.email;
 var collaborator_email = req.params.email;
 if (session_email != collaborator_email) {
  res.send(403, {
     err: session_email + " is not " + collaborator_email
    });
  return;
 }
 shoppingconf.isCollaborator(req.params.shopping_id, session_email, function(err, result){
  if(err) {
   res.send(400, {
    err: "error"
   });
  } else {
   if (!result) {
    res.send(403, {
     err: session_email + " is not a collaborator"
    });
   } else {
    next();
   }
  }
 });
 
}

module.exports = handler;

