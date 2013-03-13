function handler(req, res, next) {
 if (req.isAuthenticated()) {
  return next();
 }
 //res.redirect('/auth/google');
 res.send(200, {
  redirect : "/auth/google"
 });
}

module.exports = handler;

