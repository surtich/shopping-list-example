iris.screen(
 function (self) {	
  function _ajaxPrepare() {
   $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {            
    //self.get("screens").hide();
    self.get("loading").show();                
    jqXHR.always(function(data) {
     if(data && data.redirect) {
      window.location.href = data.redirect;
      return;
     }
     self.get("loading").hide();
    //self.get("screens").show();
    });            
   });                
  }
            
  function _createScreens() {
   self.screens("screens", [
    ["home", iris.path.screen.home.js],
    ["categories", iris.path.screen.categories.js],
    ["shopping", iris.path.screen.shopping.js],
    ["admin", iris.path.screen.admin.js]
    ]);
  }
        
  function _changeLang(link) {
   var regExp = /[?&]lang=[a-z][a-z][\-_][A-Z][A-Z]/;
   var lang = window.location.href.match(regExp);
   var url = window.location.href;
   var hash = window.location.hash;
   if ( lang === null) {
    lang = "lang=" + link.data("lang");
    if (window.location.href.match(/[?]/)) {
     lang = "&" + lang;                            
    } else {
     lang = "?" + lang;
    }
    url = url.substr(0, url.indexOf(hash));
    url += lang;
    url += hash;
   } else {
    var first = lang[0].substr(0,6);
    url = window.location.href.replace(regExp, first + link.data("lang"));                       
   }
   window.location.href = url;
  }
            
            
  iris.translations("es_ES", {    
   LOADING: "Cargando...",
   MENU: {
    WELCOME: "Ejemplo de lista de la compra",
    HOME: "Incio",
    PRODUCTS: "Productos",
    SHOPPING_LIST: "Lista de la compra",
    ADMIN: "Administrar",
    LOGIN: "Conectar",
    LOGOUT: "Desconectar"
   }
  });
            
  iris.translations("en_US", {
   LOADING: "Loading...",
   MENU: {
    WELCOME: "Shopping List Example",
    HOME: "Home",
    PRODUCTS: "Products",
    SHOPPING_LIST: "Shopping List",
    ADMIN: "Admin",
    LOGIN: "Login",
    LOGOUT: "Logout"
   }
  });
        
  self.create = function () {
            
   self.tmpl(iris.path.screen.welcome.html);
            
   _ajaxPrepare();
            
   _createScreens();
            
   $("[data-lang]").click(
    function (event) {
     _changeLang($(this));
     event.preventDefault();
    }
    );
   iris.resource(iris.path.service.auth).getUser(function(user) {
    if (user && user.email) {
     self.get("login").text(iris.translate("MENU.LOGOUT") + " (" + user.email + ")").attr("href", "/logout");
    } else{
     self.get("login").text(iris.translate("MENU.LOGIN")).attr("href", "/auth/google");;
    }
   });
   if ( !document.location.hash ) {                
    iris.navigate("#/home"); //Default page
   }
  };
 } , iris.path.screen.welcome.js);
