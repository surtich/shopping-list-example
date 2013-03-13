$(document).ready(
 function () {
        
  function _setLang() {    
   var regExp = /[?&]lang=[a-z][a-z][\-_][A-Z][A-Z]/;
   var lang = window.location.href.match(regExp);
   if ( lang !== null) {
    iris.locale(lang[0].substring(lang[0].length - 5, lang[0].length));
   } else {
    iris.locale("en_US");
   }
  }
            
  iris.translations("es_ES", {                
   ERROR: "Se ha producido el siguiente error",
   JQUERY : {
    DATATABLES: {
     SEARCH: "Buscar",
     NEXT: "Siguiente",
     PREVIOUS: "Anterior",
     SHOW: "Mostrando _MENU_ líneas"
    }
   }
            
  });
            
  iris.translations("en_US", {                
   ERROR: "There was an error",
   JQUERY : {
    DATATABLES: {
     SEARCH: "Search",
     NEXT: "Next",
     PREVIOUS: "Previous",
     SHOW: "Show _MENU_ entries"
    }
   }
  });
        
  iris.locale(
   "en_US", {
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    dateFormat: "m/d/Y h:i:s",
    currency: {
     formatPos: "n",
     formatNeg: "(n)",
     decimal: ".",
     thousand: ",",
     precision: 2
    }
   }
   );

  iris.locale(
   "es_ES", {
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    dateFormat: "d/m/Y H:i:s",
    currency: {
     formatPos: "n",
     formatNeg: "-n",
     decimal: ",",
     thousand: ".",
     precision: 2
    }
   }
   );

  _setLang();
        
  iris.path = {
   screen: {
    welcome: {
     js: "/shopping/screen/welcome.js", 
     html: "/shopping/screen/welcome.html"
    },
    home: {
     js: "/shopping/screen/home.js", 
     html: "/shopping/screen/home.html"
    },
    categories: {
     js: "/shopping/screen/products/categories.js", 
     html: "/shopping/screen/products/categories.html"
    },
    admin: {
     js: "/shopping/screen/admin/admin.js", 
     html: "/shopping/screen/admin/admin.html"
    },
    shopping: {
     js: "/shopping/screen/list/shopping.js", 
     html: "/shopping/screen/list/shopping.html"
    }
   },
   ui: {
    category_list_item: {
     js: "/shopping/ui/products/category_list_item.js", 
     html: "/shopping/ui/products/category_list_item.html"
    },
    product_list_item: {
     js: "/shopping/ui/products/product_list_item.js", 
     html: "/shopping/ui/products/product_list_item.html"
    },
    product_shopping_list_item: {
     js: "/shopping/ui/list/product_shopping_list_item.js", 
     html: "/shopping/ui/list/product_shopping_list_item.html"
    },
    list: {
     js: "/shopping/ui/admin/list.js", 
     html: "/shopping/ui/admin/list.html"
    }
   },
   service: {
    categories: "/shopping/service/categories.js",
    products: "/shopping/service/products.js",
    shopping: "/shopping/service/shopping.js",
    shoppingLists: "/shopping/service/shoppingLists.js",
    auth: "/shopping/service/auth.js"
   }
  };
        
  iris.evts = {
   shopping : {
    listCreated: "shopping_list_created",
    productAdded: "shopping_product_added",
    productRemoved: "shopping_product_removed",
    productPurchased: "shopping_product_purchased"
   },
   user : {
    changed: "user_changed"
   }
  };
        
  iris.on(iris.SERVICE_ERROR, function(p_request, p_textStatus, p_errorThrown) {
   if (p_request.request.status === 401) {
    window.location.href = "/login?next=/#admin";
   }
  });
        
  iris.baseUri(".");
  iris.enableLog("localhost");
  iris.welcome("/shopping/screen/welcome.js");
        
 }
 );