iris.screen(

function (self) {	
 var user = null;
 
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
  
 function newWindow(url, name) {
  var popupWindow = window.open(
  url,
  name,'height=500,width=450,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');
  return popupWindow;
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
   
  if ( !document.location.hash ) {                
   iris.navigate("#/home"); //Default page
  }
   
  self.get("login").click(function(event) {
   event.preventDefault();
   var authWin = newWindow($(this).data("url"),"auth");
   var it = setInterval(function() {
    if (authWin.closed) {
     clearInterval(it);
     iris.resource(iris.path.service.auth).getUser(function(u) {
      if (u != user) {
       user = u;
       iris.notify(iris.evts.user.changed);
       iris.navigate("#/home");
      }
      setUser();
     }, function(){}, true);
    }
   }, 200);
  });
   
  iris.resource(iris.path.service.auth).getUser(function(u) {
   user = u;
   setUser();
  }); 
  
 };
} , iris.path.screen.welcome.js);
