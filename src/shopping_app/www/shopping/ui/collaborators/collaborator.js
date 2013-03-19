iris.ui(function(self) {	
 var collaborator = {};
 var shopping_id = null;
 var owner = null;
 
 function changeState (state) {
  collaborator.state = state;
  self.get("state").text(iris.translate(collaborator.state.toUpperCase()));
  showOrHide();
 }
 
 function showOrHide() {
  switch (collaborator.state) {
   case "pending":
    self.get("accept").show();   
    self.get("reject").show();
    break;
   case "rejected":
    self.get("accept").show();   
    self.get("reject").hide();   
    break;
   case "accepted":
    self.get("reject").show();   
    self.get("accept").hide();   
    break;
  }
 }
    
 self.create = function() {
  collaborator = self.setting("collaborator");
  shopping_id = self.setting("shopping_id");
  owner = self.setting("owner");
  self.tmpl(iris.path.ui.collaborator.html, collaborator);
  self.inflate({
   state: iris.translate(collaborator.state.toUpperCase())
  });
  
  self.get("owner").text(owner);
  
  self.get("accept").click(function() {
   iris.resource(iris.path.service.collaborators).acceptCollaboration(shopping_id, collaborator.email, function() {
    changeState("accepted");
   }, function() {
   });
  });
  
  self.get("reject").click(function() {
   iris.resource(iris.path.service.collaborators).rejectCollaboration(shopping_id, collaborator.email, function() {
    changeState("rejected");
    }, function() {
    });
  });
  
  self.get("accept").hide();
  self.get("reject").hide();
  
  iris.resource(iris.path.service.auth).getUser(function(user) {
   if (owner === user.email) {
    self.get("remove").click(function() {
     iris.resource(iris.path.service.collaborators).removeCollaborator(shopping_id, collaborator.email, function() {
      self.setting("destroyUI")(self);
     }, function() {
     });
    });
   } else {
    self.get("remove").hide();
    if (collaborator.email === user.email) {
     showOrHide();
    }
   }
  });
 };
 
    
    
}, iris.path.ui.collaborator.js);  