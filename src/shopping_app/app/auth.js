var commons = require('../../lib/commons'),
passport = commons.passport,
GoogleStrategy	= commons.GoogleStrategy,
util = commons.util,
hero	= commons.hero,
app		= hero.app;

function auth (self) {

 passport.use(
  new GoogleStrategy({
   clientID    : self.config.oauth.login.google.client_id,
   clientSecret: self.config.oauth.login.google.secret_key,
   callbackURL : self.config.oauth.login.google.redirect_uri
  },

  function(accessToken, refreshToken, profile, done) {
   // asynchronous verification, for effect...
   process.nextTick(function () {
      
    // To keep the example simple, the user's Google profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the Google account with a user record in your database,
    // and return that user instead.
    //console.log("passport.use profile=" + JSON.stringify(profile));
    return done(null, profile);
   });
  }
  ));


 // GET /auth/google
 //   Use passport.authenticate() as route middleware to authenticate the
 //   request.  The first step in Google authentication will involve
 //   redirecting the user to google.com.  After authorization, Google
 //   will redirect the user back to this application at /auth/google/callback
 app.get('/auth/google',
  passport.authenticate('google', {
   scope: ['https://www.googleapis.com/auth/userinfo.profile',
   'https://www.googleapis.com/auth/userinfo.email']
  }),
  function(req, res){
  // The request will be redirected to Google for authentication, so this
  // function will not be called.
  });
     
 // GET /auth/google/callback
 //   Use passport.authenticate() as route middleware to authenticate the
 //   request.  If authentication fails, the user will be redirected back to the
 //   login page.  Otherwise, the primary route function function will be called,
 //   which, in this example, will redirect the user to the home page.
 app.get('/oauth2callback', 
  passport.authenticate('google', {
   failureRedirect: '/auth/google'
  }),
  function(req, res) {
   res.redirect('/');
  });

 app.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();
  res.redirect('/');
 });
}

module.exports = auth;