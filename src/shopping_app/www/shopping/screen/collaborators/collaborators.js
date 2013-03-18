iris.screen(
 function (self) {
 
  var shopping_id = null;
  var owner = null;

  function newUI(collaborator) {
   self.ui("table_container", iris.path.ui.collaborator.js, {
    "collaborator": collaborator,
    "shopping_id": shopping_id,
    "owner": owner,
    "destroyUI": function(ui) {
     self.destroyUI(ui); 
    }
   },  self.APPEND);
  }
  function _inflate(collaborators) {
   $.each(collaborators,                
    function(index, collaborator) {                    
     newUI(collaborator);
    });
  }
        
        
  self.create = function () {
   self.tmpl(iris.path.screen.collaborators.html);
   
  };
        
  self.awake = function (params) {
   self.destroyUIs("table_container");
   self.get("emailAdd").val("");
   self.get("ownerAdd").text(params.owner);
   if (params.shopping) {
    shopping_id = params.shopping;
    owner = params.owner;
    iris.resource(iris.path.service.collaborators).getCollaborators(shopping_id, _inflate, function() {
     alert("error");
    });
    self.get("add").off("click").click(function() {
     if (self.get("emailAdd").get(0).validity.valid) {
      iris.resource(iris.path.service.collaborators).addCollaborator(shopping_id, self.get("emailAdd").val(), function() {
       newUI({email: self.get("emailAdd").val(), state: "pending"});
       self.get("emailAdd").val("");
       });
     }
    });
    iris.resource(iris.path.service.auth).getUser(function(user) {
     self.get("rowAdd").toggle(owner === user.email);
    });
    
   }
  };
        
        
  iris.translations("es_ES", { 
   COLLABORATOR: "Colaborador",
   STATE: "Estado",
   ACTION: "Acción",
   PENDING: "Pendiente",
   ACCEPTED: "Aceptado",
   REJECTED: "Rechazado",
   ADD: "Añadir",
   REMOVE: "Eliminar",
   ACCEPT: "Aceptar",
   REJECT: "Rechazar"
  });
            
  iris.translations("en_US", {          
   COLLABORATOR: "Collaborator",
   STATE: "State",
   ACTION: "Action",
   PENDING: "Pending",
   ACCEPTED: "Accepted",
   REJECTED: "Rejected",
   ADD: "Add",
   REMOVE: "Remove",
   ACCEPT: "Accept",
   REJECT: "Reject"      
  });

 }, iris.path.screen.collaborators.js);