var commons = require('../../lib/commons'),
hero	= commons.hero,
app		= hero.app;

function ensureAuthenticated(req, res, next) {
 if (req.isAuthenticated()) {
  return next();
 }
 //res.redirect('/auth/google');
 res.send(200, {
   redirect : "/auth/google"
  });
}

function login(req, res, next) {
 res.redirect("/auth.html");
}

function logout(req, res, next) {
 res.redirect("/auth.html");
}

module.exports = function() {
 app.all("/shoppings", ensureAuthenticated);
 app.all("/shopping", ensureAuthenticated);
 app.all("/shopping/add*", ensureAuthenticated);
 app.all("/shopping/remove*", ensureAuthenticated);
 app.all("/shopping/purchase*", ensureAuthenticated);
 
 app.get("/connected", login);
 app.get("/disconnected", logout);
};
 