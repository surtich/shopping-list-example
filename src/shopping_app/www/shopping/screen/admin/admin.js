iris.screen(
 function (self) {
        
  function _removeUI(ui) {    
   if (ui) {
    self.destroyUI(ui);
   }
  }
        
  function _newList() {
   self.ui("list_container", iris.path.ui.list.js, {
    list: {
     "_id": iris.resource(iris.path.service.shopping).shopping._id,
     "lastUpdated": iris.resource(iris.path.service.shopping).shopping._id,
     "actual": true,
     "numProducts": iris.resource(iris.path.service.shopping).shopping.numProducts(),
     "numPurchased": iris.resource(iris.path.service.shopping).shopping.numPurchased(true),
     "state": "owner"
    },
    createNew: _newList
   },self.PREPEND);
  }

  function _inflate(lists) {
   var actual = false;
   $.each(lists,                
    function(index, list) {                    
     list.actual = false;
     if (!actual && list._id === iris.resource(iris.path.service.shopping).shopping._id) {
      list.actual = true;
      actual = true;
     }
     
     list.numProducts = list.value.hasOwnProperty("products") ? list.value.products : 0;
     list.numPurchased = list.value.hasOwnProperty("purchased") ? list.value.purchased : 0;
     list.owner = list.value.hasOwnProperty("owner") ? list.value.owner : "";
     list.lastUpdated = list.value.hasOwnProperty("last_updated") ? iris.date(new Date(list.value.last_updated), "H:i:s d/m/Y"): "";
     list.state = list.value.hasOwnProperty("state") ? list.value.state: "owner";
     self.ui("list_container", iris.path.ui.list.js, {
      "list": list,
      removeUI: _removeUI
                        
     },  self.APPEND);
    }
    );
   if (!actual) {
    _newList();
   }
  }
        
        
  self.create = function () {
   self.tmpl(iris.path.screen.admin.html);
   self.shopping = iris.resource(iris.path.service.shopping).shopping;
  };
        
  self.awake = function () {
   self.destroyUIs("list_container");
   iris.resource(iris.path.service.shoppingLists).getByUser(function(lists) {
    if (lists && lists.popup_login) {
     iris.resource(iris.path.service.auth).newWindow(lists.popup_login, "auth", iris.resource(iris.path.service.auth).userChanged);
     return;
    }
    lists.sort(function (list1, list2) {
     if (list1.value.hasOwnProperty("last_updated") && list2.value.hasOwnProperty("last_updated")) {
      return new Date(list2.value.last_updated) - new Date(list1.value.last_updated);
     } else {
      return 0;
     }
    });
    _inflate(lists);
    
   }, function(p_request, p_textStatus, p_errorThrown) {
    throw p_textStatus;
   });
         
  };
        
        
  iris.translations("es_ES", {                
   ACTIONS: {
    CREATE_NEW: "Clonar",
    CLONE: "Clonar",
    SAVE: "Guardar",
    REMOVE: "Eliminar",
    UPDATE: "Actualizar",
    LOAD: "Cargar",
    COLLABORATORS: "Colaboradores"
   },
   UPDATED: "Última grabación",
   COLLABORATOR: "Colaborador",
   OWNER: "Propietario"
  });
            
  iris.translations("en_US", {          
   ACTIONS: {
    CREATE_NEW: "Clone",
    CLONE: "Clone",
    SAVE: "Save",
    REMOVE: "Remove",
    UPDATE: "Update",
    LOAD: "Load",
    COLLABORATORS: "Collaborators"
   },
   UPDATED: "Last updated",
   COLLABORATOR: "Collaborator",
   OWNER: "Owner"
  });

 }, iris.path.screen.admin.js);