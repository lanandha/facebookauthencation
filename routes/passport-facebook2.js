    var passport            = require('passport');
    var FacebookStrategy    = require('passport-facebook').Strategy;
     const User = require('../models/facebook_db');

var facebookAuth = {
        'clientID'        : /*'202412170895789',//'294300975086186',//'277792556742201',*/'268955121114794', // facebook App ID
        'clientSecret'    : /*'c353879ad3bb07830afbab9d4a54f749',//'a5a92517a81a290aa58557019230f931',//'ae68891369eba067f015c4fccc42fcb4',*/'fc6a6787def21e9f87507ba56c75d2f1', // facebook App Secret
        'callbackURL'     : 'http://localhost:3000/auth/facebook/callback'
    };
 
// hardcoded users, ideally the users should be stored in a database
var users = [
{"id":111, "username":"amy", "password":"amyspassword"},
{
    "id" : "222",
    "email" : "test@test.com", 
    "name" : "Anandh", 
    "token" : "DeSag3sEgaEGaYRNKlQp05@diorw"}
];
function findUser(id) {
    for(var i=0; i<users.length; i++) {
        if(id === users[i].id) {
            return users[i]
        }
    }
    return null;
}
 
// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {
    done(null, users[0].id);
});
passport.deserializeUser(function (id, done) {
    done(null, users[0]);
});
  
// passport facebook strategy
passport.use(new FacebookStrategy({
    "clientID"        : facebookAuth.clientID,
    "clientSecret"    : facebookAuth.clientSecret,
    "callbackURL"     : facebookAuth.callbackURL,
    profileFields: ['id', 'displayName', 'photos', 'email']
},
function (token, refreshToken, profile, done) {

 //console.log(profileFields);
    //console.log(refreshToken);
    console.log(profile);
    console.log(done);
    /*var user = findUser(profile.id);
    if (user) {
        console.log(users);
        return done(null, user);
    } else {
        var newUsers = {
            "id":       profile.id,
            "name":     profile.name.givenName + ' ' + profile.name.familyName,
            //"email":    (profile.emails[0].value || '').toLowerCase(),
            "token":    token
        };
          users.push(newUsers);
        console.log(users);
    //    return done(null, newUsers);
    }
//}));*/
User.findOrCreate({ userid: profile.id }, { name: profile.displayName,userid: profile.id,email:profile.emails,image:profile.picture }, (err, user)=> {
        console.log("database saved");
    console.log(profile._json.name);
    console.log(profile._json.id);
         console.log(profile.id);
         //console.log(profile.emails[0].value);
        console.log(profile.profileUrl);
        
     // return done(err, user);
         //if(err) throw err;
         
        });
  
        return done(null, profile);
   }
));
/*const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const User = require('../models/facebook_db');
//const LocalStrategy = require('passport-local');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if(user) {
      user.password = null;
      user.facebookId = null;
    }
    done(err, user);
  });
});
//passport facebook login
passport.use( new FacebookStrategy(
  {
    clientID: '268955121114794',//"277792556742201",
    clientSecret: 'fc6a6787def21e9f87507ba56c75d2f1',//"ae68891369eba067f015c4fccc42fcb4",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName','photos','emails'],
  },
  function(accessToken, refreshToken, profile,profileFields, done) 
  {
    console.log(profileFields);
    User.findOne({userid: profile.id}, (err, user) => {
      if(err) {
        return done(err)
      }
      if(!user) {
        User.create({
          userid: profile.id,
          name: profile.displayName,
          //email:profile.emails,
          //image:profile.photos
          
          }, (err, user) => {
            done(err, user);
          }
        );
      } else {
        done(err, user);
      } 
      //console.log(profile._json.name);
       //console.log(profile._json.email);
        //console.log(profile._json.picture.data);     
    });
  }
));*/
module.exports={passport};
