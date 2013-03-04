var util = require('util'),
express = require('express'),
app = express(),
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

function oauth (app, passport){
    // API Access link for creating client ID and secret:
    // https://code.google.com/apis/console/
    var GOOGLE_CLIENT_ID = "841851172902-7c9doph39q1n9dk2c64jj6sdr8d3ulci.apps.googleusercontent.com";
    var GOOGLE_CLIENT_SECRET = "h7IriaN4vtxMnJPU8NSP-RBT";
    
    if(process.env.SUBDOMAIN){
        GOOGLE_CLIENT_ID = "841851172902-5ocu8mhr5gu3jdjh06nd6lm0jldj49sd.apps.googleusercontent.com";
        GOOGLE_CLIENT_SECRET = "4YKre3tjZZCEcq_PuTVuWQEp";
    }
    
    var CALLBACK_URL = app.get('url') + "oauth2callback";

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete Google profile is
    //   serialized and deserialized.
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });


    // Use the GoogleStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Google
    //   profile), and invoke a callback with a user object.
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: CALLBACK_URL
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

module.exports = oauth;