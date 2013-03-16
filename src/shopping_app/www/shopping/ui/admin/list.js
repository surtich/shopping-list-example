iris.ui(function(self) {	
 var list = {};
    
 function _inflate() {
  if (list.actual) {
   if (!list._id) {
    self.get("btn_create").hide();
    self.get("btn_remove").hide();
   } else {
    self.get("btn_create").html("<i class=\"icon-folder-open icon-white\"></i>" + iris.translate("ACTIONS.CREATE_NEW")).show();
    self.get("btn_remove").show();
   }
   self.get("btn_load").hide();
  } else {
   self.get("btn_create").hide();
   self.get("btn_load").show();
  }
        
  self.get("actual").toggle(list.actual);
  //self.get("btn_save").toggleClass("disabled", model.shoppingList.getUpdated()).prop("disabled", model.shoppingList.getUpdated());
  var lastUpdated = list.lastUpdated;
  if (lastUpdated) {
   self.get("last_updated").text(iris.translate("UPDATED") + ": " + lastUpdated);
  }
        
  var proportion = 0;
  if (list.numProducts > 0) {
   proportion = 100 * list.numPurchased / list.numProducts;
  }
        
  self.get("progress_numeric").text(list.numPurchased + "/" + list.numProducts);
  self.get("progress_slider").css("width", proportion + "%");
  self.get("progress_link").css("left", proportion + "%");
 }
    
    
    
 self.create = function() {
  self.tmpl(iris.path.ui.list.html);
        
        
  self.get("btn_create").click(function() {
   iris.resource(iris.path.service.shopping).cloneShoppingList(list._id, function(shopping) {
    iris.navigate("#/shopping");
   });
  });
        
        
  self.get("btn_remove").click(function() {
   iris.resource(iris.path.service.shopping).removeShoppingList(list._id, function() {
    self.setting("removeUI")(self);
    if (list.actual) {
     iris.resource(iris.path.service.shopping).createShoppingList();
     iris.navigate("#/categories");
    }
   });
  });
        
  self.get("btn_load").click(function() {
   iris.resource(iris.path.service.shopping).getShoppingList(list._id, function(shopping) {
    iris.navigate("#/shopping");
   });
  });
 };
 
 self.awake = function() {
  list = self.setting("list");
  if (list.actual) {
  //list.numProducts = model.shoppingList.getShoppingProducts().length;
  //list.numPurchased = model.shoppingList.countPurchased();
  }
  _inflate();
 };
    
    
}, iris.path.ui.list.js);  