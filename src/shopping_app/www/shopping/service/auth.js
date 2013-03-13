iris.resource(
 function(self){
  
  var currentUser = null;
  
  self.cleanUser = function() {
   currentUser = null;
  }
  
  self.getUser = function(success, error){
   if (currentUser) {
    success(currentUser);
    return;
   }
   
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
