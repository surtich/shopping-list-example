iris.screen(

 function (self) {	
  var user = null;
  var modal = null;
 
  function _ajaxPrepare() {
   $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {            
    //self.get("screens").hide();
    self.get("loading").show(); 
    jqXHR.always(function(data, rdo) {
     self.get("loading").hide();
     if (rdo === "error") {
      modal.get('div_modal').modal('show');
      modal.get('header').text(iris.translate("ERROR"));
      var text = "Error " + data.status;
      if (data.responseText) {
       try {
        text += " " + JSON.parse(data.responseText).err;
       } catch(e) {
        text = " " + data.responseText;
       }
       self.get("text").html(text);
      }
     } else if(data) {
      if(data.redirect) {
       window.location.href = data.redirect;
       return;
      } else if (data.popup_login) {
       iris.resource(iris.path.service.auth).newWindow(data.popup_login, "auth", iris.resource(iris.path.service.auth).userChanged);
      }
     }
    //self.get("screens").show();
    });            
   });                
  }
            
  function _createScreens() {
   self.screens("screens", [
    ["home", iris.path.screen.home.js],
    ["categories", iris.path.screen.categories.js],
    ["shopping", iris.path.screen.shopping.js],
    ["admin", iris.path.screen.admin.js],
    ["collaborators", iris.path.screen.collaborators.js]
    ]);
  }
        
  function _changeLang(link) {
   var regExp = /[?&]lang=[a-z][a-z][\-_][A-Z][A-Z]/;
   var origin = window.location.origin;
   var url = window.location.href;
   var hash = window.location.hash;
   var params = url.substr(0, url.indexOf(hash))
   params = params.substr(origin.length + 1);
   var lang = params.match(regExp);
   if ( lang === null) {
    lang = "lang=" + link.data("lang");
    if (params.match(/[?]/)) {
     lang = "&" + lang;                            
    } else {
     lang = "?" + lang;
    }
    url = origin + "/" + params + lang + hash;
   } else {
    var first = lang[0].substr(0,6);
    url = window.location.href.replace(regExp, first + link.data("lang"));                       
   }
   window.location.href = url;
  }
  
  
  
  function setUser() {
   if (user && user.email) {
    self.get("login").text(iris.translate("MENU.LOGOUT") + " (" + user.email + ")").data("url", "/logout");
   } else{
    self.get("login").text(iris.translate("MENU.LOGIN")).data("url", "/auth/google");
   }
  }
            
            
  iris.translations("es_ES", {    
   LOADING: "Cargando...",
   ERROR: "Se ha producido un error",
   OK: "Aceptar",
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
   ERROR: "There is an error",
   OK: "Accept",
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
   
   modal = self.ui("modal", iris.path.ui.modal.js);
            
   _ajaxPrepare();
            
   _createScreens();
            
   $("[data-lang]").click(
    function (event) {
     _changeLang($(this));
     event.preventDefault();
    }
    );
   
   if ( !document.location.hash ) {                
    iris.navigate("#/home"); //Default page
   }
   
   self.get("login").click(function(event) {
    event.preventDefault();
    iris.resource(iris.path.service.auth).newWindow($(this).data("url"), "auth", iris.resource(iris.path.service.auth).userChanged);
   });
   
   self.on(iris.evts.user.changed ,function(u) {
    user = u;
    setUser();
   });
   iris.resource(iris.path.service.auth).getUser(function(u) {
    user = u;
    setUser();
   });
   
  };
 } , iris.path.screen.welcome.js);
