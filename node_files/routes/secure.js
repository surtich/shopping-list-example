//App routes
module.exports = function(app){
    
    function requireLogin(req, res, next) {
        if (req.session.user_id) {
            next(); // allow the next route to run
        } else {
            // require the user to log in
            res.redirect("/auth/twitter"); // or render a form, etc.
        }
    }
    
    app.all("/list/*", requireLogin, function(req, res, next) {
        next(); // if the middleware allowed us to get here,
    // just move on to the next route handler
    });
}