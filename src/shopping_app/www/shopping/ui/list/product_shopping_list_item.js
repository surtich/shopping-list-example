iris.ui(function(self) {	
 self.create = function() {
  self.tmplMode(self.APPEND);
  self.product = self.setting("product");                
  self.tmpl(iris.path.ui.product_shopping_list_item.html, self.product);
  if (self.product.purchased === true) {
   self.get("order").addClass("purchased");
   self.get("nameProduct").addClass("purchased");
   self.get("icon-shopping-cart").removeClass("icon-shopping-cart").addClass("icon-shopping-cart-remove");
   self.get("email").toggleClass("purchased", self.product.purchased);
   self.get("last_updated").toggleClass("purchased", self.product.purchased);
  }
  
  if (self.setting("removeProduct") !== false) {
   self.get("remove").on("click", self.setting("removeProduct"));
  } else {
   self.get("remove").addClass("disabled").prop("disabled", true); 
  }
  
  self.get("buy").on("click",
   function () {
    iris.resource(iris.path.service.shopping).shopping.purchaseShoppingProduct(self.product, !self.product.purchased, function() {});
   }
   );
    
  self.on(iris.evts.shopping.productPurchased, onPurchase);
  self.on(iris.evts.shopping.productPurchased_io, onPurchase);
  
  iris.resource(iris.path.service.auth).getUser(function(user) {
   if (!user) {
    self.get("email").text("");
    self.get("last_updated").text("");
   }
  });
 
  
 };
    
 self.destroy = function () {
  self.get("remove").off("click");
  self.get("buy").off("click");
 };
 
 function onPurchase(purchasedProduct) {
  if(purchasedProduct._id === self.product._id) {
   self.product = purchasedProduct;
   self.get("order").toggleClass("purchased", self.product.purchased);
   self.get("nameProduct").toggleClass("purchased", self.product.purchased);
   self.get("email").toggleClass("purchased", self.product.purchased);
   self.get("last_updated").toggleClass("purchased", self.product.purchased);
   self.get("icon-shopping-cart").toggleClass("icon-shopping-cart-remove", self.product.purchased);
   self.get("icon-shopping-cart").toggleClass("icon-shopping-cart", !self.product.purchased);
   iris.resource(iris.path.service.auth).getUser(function(user) {
    if (!user) {
     self.get("email").text("");
     self.get("last_updated").text("");
    } else {
     self.get("email").text(purchasedProduct.email);
     self.get("last_updated").text(iris.date(new Date(purchasedProduct.last_updated), "Y/m/d H:i:s"));
    }
   });
  }
 }
}, iris.path.ui.product_shopping_list_item.js);