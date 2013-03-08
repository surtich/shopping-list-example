iris.screen(
 function (self) {
  
  self.shopping = null;
  
  iris.translations("es_ES", {                
   SHOPPING_LIST: {
    EMPTY: "La cesta está vacía.",
    REFRESH: "Actualizar",
    REMOVE_ALL: "Borrar todos",
    CHECK_ALL: "Marcar todos",
    UNCHECK_ALL: "Desmarcar todos",
    INVERT_ALL: "Invertir",
    REMOVE_PURCHASED: "Borrar marcados",
    ORDER: "Orden",
    PRODUCT: "Producto",
    ACTION: "Acción",
    BUY: "Cambiar estado",
    REMOVE: "Borrar"
   }
  });
            
  iris.translations("en_US", {                
   SHOPPING_LIST: {
    EMPTY: "The Shopping list is empty.",
    REFRESH: "Refresh",
    REMOVE_ALL: "Remove All",
    CHECK_ALL: "Check All",
    UNCHECK_ALL: "Uncheck All",
    INVERT_ALL: "Invert checks",
    REMOVE_PURCHASED: "Remove purchased",
    ORDER: "Order",
    PRODUCT: "Product",
    ACTION: "Action",
    BUY: "Change state",
    REMOVE: "Remove"
   }
  });
            
  self.create = function () {
   self.tmpl(iris.path.screen.shopping.html);            
   self.get("div_shopping").hide();
   _asignEvents();
   self.shopping = iris.resource(iris.path.service.shopping).shopping;
  };
                
  self.awake = function (params) {
   _inflate();
  };
        
  function _asignEvents() {
   
   self.on(iris.evts.shopping.productAdded, _inflate);
  
   self.on(iris.evts.shopping.productRemoved, function() {
    _changeStateButtons();
    _changeVisibilityShoppingTable();
   });
  
   self.on(iris.evts.shopping.productPurchased, function() {
    _changeStateButtons();
   });
           
   self.get("btn_refresh").on("click", function () {
    _inflate();
   }
   );
                
   self.get("btn_remove_all").on("click", function () {
    self.shopping.removeAllShoppingProducts(_inflate);
   }
   );
                
   self.get("btn_check_all").on("click", function () {
    self.shopping.purchaseAllShoppingProducts(true, _changeStateButtons);
   }
   );
                
   self.get("btn_uncheck_all").on("click", function () {
    self.shopping.purchaseAllShoppingProducts(false, _changeStateButtons);
   }
   );
                
   self.get("btn_invert_check").on("click", function () {
    self.shopping.invertPurchaseAllShoppingProducts(_changeStateButtons);
   }
   );
                
   self.get("btn_remove_checked").on("click", function () {
    self.shopping.removePurchasedProducts(_inflate);
   }
   );
             
  }
        
  function _inflate() {
   self.destroyUIs("shoppingList_products");
   _destroyShoppingTable();
   _loadShoppingProducts();
   _createShoppingTable();
   _changeVisibilityShoppingTable();
  }
                        
  function _loadShoppingProducts() {
   var products = self.shopping.getSortedShoppingProducts();
   //var products = self.shopping.products;
   if (products.length > 0) {                
    $.each(products,
     function(index, product) {
      var ui = self.ui("shoppingList_products", iris.path.ui.product_shopping_list_item.js, {
       "product": product,
       "removeProduct": function() {
        _destroyUI.call(this, ui);
       }
      });
     }
     );
   }
  }
  
  function _destroyUI(ui) {
   var table = self.get("shopping_table");
   var row = $(this).closest("tr").get(0);
   iris.resource(iris.path.service.shopping).shopping.removeShoppingProduct(ui.product, function() {
    table.fnDeleteRow(table.fnGetPosition(row));
    self.destroyUI(ui);
   });
  }
        
  function _destroyShoppingTable() {
   var table = self.get("shopping_table");
   if (table.hasOwnProperty("fnClearTable")) {
    table.fnClearTable();
    table.fnDestroy();
   }
  }
        
  function _createShoppingTable() {
   var table = self.get("shopping_table");            
   table.dataTable(
   {
    "bPaginate": true,
    "bInfo" : false,
    "bAutoWidth": false,
    "oLanguage": {
     "sSearch": iris.translate("JQUERY.DATATABLES.SEARCH") + ":",
     "sZeroRecords": iris.translate("SHOPPING_LIST.EMPTY"),
     "sLengthMenu": iris.translate("JQUERY.DATATABLES.SHOW"),
     "oPaginate": {
      "sNext": iris.translate("JQUERY.DATATABLES.NEXT"),
      "sPrevious": iris.translate("JQUERY.DATATABLES.PREVIOUS")
     }
    },
    "aoColumnDefs": [
    {
     "bSortable": false, 
     "aTargets": [ 2 ]
    },
    {
     "sType": "html" , 
     "aTargets": [0]
    }
    ],
    "aaSorting": []
   }   
   );
  }
        
  function _changeVisibilityShoppingTable() {
   var products = self.shopping.products;
   if (products.length > 0) {
    self.get("div_shopping").show();
    self.get("msg").hide();
    _changeStateButtons();
   } else {
    self.get("div_shopping").hide();
    self.get("msg").show();
   }
  }
        
  function _changeStateButtons() {
   self.get("btn_check_all").toggleClass("disabled", !self.shopping.hasNoPurchasedProducts()).prop("disabled", !self.shopping.hasNoPurchasedProducts());
   self.get("btn_uncheck_all").toggleClass("disabled", !self.shopping.hasPurchasedProducts()).prop("disabled", !self.shopping.hasPurchasedProducts());
   self.get("btn_remove_checked").toggleClass("disabled", !self.shopping.hasPurchasedProducts()).prop("disabled", !self.shopping.hasPurchasedProducts());
  }
    
        
 }, iris.path.screen.shopping.js);
    