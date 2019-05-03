const passport = require('passport'), 
    GoogleStrategy = require('passport-google-oauth20');

passport.use(new GoogleStrategy)({
    //Strategy options
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET
}), () => {
    //passport callback
}