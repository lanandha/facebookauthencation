var express             = require('express'),
    app                 = express(),
    passport            = require('passport'),
    session             = require('express-session');
   require('../routes/passport-facebook');
 
 
// initialize passposrt and and session for persistent login sessions
app.use(session({
    secret: 'secret',//"tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
 
 
// route middleware to ensure user is logged in, if it's not send 401 status
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
 
    res.sendStatus(401);
}
 
// home page
app.get("/", function (req, res) {
    res.send("Hello!");
});
 
// login page
app.get("/login", function (req, res) {
    res.send("<a href='/auth/facebook'>login through facebook</a>");
});
 
 
// send to facebook to do the authentication
app.get("/auth/facebook", passport.authenticate("facebook", { scope : "email" }));
// handle the callback after facebook has authenticated the user
app.get("/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect : "/content",
        failureRedirect : "/"
}));
 
 
// content page, it calls the isLoggedIn function defined above first
// if the user is logged in, then proceed to the request handler function,
// else the isLoggedIn will send 401 status instead
app.get("/content", isLoggedIn, function (req, res) {
    res.send("Congratulations! you've successfully logged in.");
});
 
// logout request handler, passport attaches a logout() function to the req object,
// and we call this to logout the user, same as destroying the data in the session.
app.get("/logout", function(req, res) {
    req.logout();
    res.send("logout success!");
});
 
// launch the app
app.listen(3000,()=>{ console.log("App running at localhost:3000");});
//module.exports={app};