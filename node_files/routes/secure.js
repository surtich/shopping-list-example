//App routes
module.exports = function (app){
    
    function requireLogin(req, res, next) {
        if (req.session.user_id) {
            next(); // allow the next route to run
        } else {
            // require the user to log in
            res.redirect("/auth/twitter"); // or render a form, etc.
        }
    }
    
    function isConected (req, res){
        var isConected = false;
        if (req.isAuthenticated()) {
            isConected = true;
        };
        res.send(isConected);
    };
    
    
    function login(req, res) {
        req.session.destroy();
        res.redirect("/auth/google");
    }

    app.all("/list/*", ensureAuthenticated, function(req, res, next) {
        next();
    });
    
    app.all("/list*", ensureAuthenticated, function(req, res, next) {
        next();
    });

    app.get('/login', login);
    app.get('/login/is_conected', isConected);
    
    
}

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/google');
}