const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { prisma } = require('./database');
const jwt = require('jsonwebtoken');

/**
 * Passport Google OAuth Strategy
 * Handles Google OAuth authentication
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await prisma.user.findUnique({
          where: { email: profile.emails[0].value.toLowerCase() },
        });

        if (user) {
          // Update user if OAuth info changed
          if (!user.providerId || user.providerId !== profile.id) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                provider: 'google',
                providerId: profile.id,
                avatar: profile.photos[0]?.value || user.avatar,
              },
            });
          }
          return done(null, user);
        }

        // Create new user
        user = await prisma.user.create({
          data: {
            name: profile.displayName || profile.name.givenName + ' ' + profile.name.familyName,
            email: profile.emails[0].value.toLowerCase(),
            provider: 'google',
            providerId: profile.id,
            avatar: profile.photos[0]?.value || null,
          },
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        provider: true,
      },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

