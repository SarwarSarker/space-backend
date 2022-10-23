const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const passport = require("passport");

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECERT,
      callbackURL: "/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      process.nextTick(() => {
        console.log(profile)
        return done(null, profile);
      });
    }
  )
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});