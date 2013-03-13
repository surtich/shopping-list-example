iris.resource(
 function(self){
  
  var currentUser = null;
  
  self.cleanUser = function() {
   currentUser = null;
  }
  
  self.getUser = function(success, error, force){
   if (currentUser && !force) {
    success(currentUser);
    return;
   }
   /*
   if (force) {
    if (currentUser) {
     currentUser= null;
    } else {
   
     currentUser = {
      email:"yo"+new Date()
     };
    }
    success(currentUser);
    return;
   }
   */
   
   
   iris.ajax({
    url : 'api/user'
   }).done(function(ret){
    currentUser = ret;
    success(currentUser);
   }).fail(function(ret) {
    error(ret);
   });
  };
 },
 iris.path.service.auth);
