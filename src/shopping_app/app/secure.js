var commons = require('../../lib/commons'),
hero	= commons.hero,
app		= hero.app;

function ensureAuthenticated(req, res, next) {
 if (req.isAuthenticated()) {
  return next();
 }
 res.redirect('/auth/google');
}


module.exports = function() {
 app.all("/list/*", ensureAuthenticated, function(req, res, next) {
  next();
 });
  
};
 