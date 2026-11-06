import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/user.model.js';
import { ENV } from './env.js';

// ─── Google OAuth Strategy ────────────────────────────────────────────────────
// Only register if credentials are set in .env
if (ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: ENV.GOOGLE_CLIENT_ID,
        clientSecret: ENV.GOOGLE_CLIENT_SECRET,
        callbackURL: `${ENV.SERVER_URL}/api/v1/auth/google/callback`,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email found in Google profile'), null);

          let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

          if (user) {
            if (!user.googleId) {
              user.googleId = profile.id;
              user.provider = 'google';
              if (!user.avatar || user.avatar.includes('ui-avatars')) {
                user.avatar = profile.photos?.[0]?.value || user.avatar;
              }
              await user.save();
            }
          } else {
            user = await User.create({
              name: profile.displayName,
              email,
              googleId: profile.id,
              provider: 'google',
              avatar:
                profile.photos?.[0]?.value ||
                `https://ui-avatars.com/api/?background=f59e0b&color=000&bold=true&name=${encodeURIComponent(profile.displayName)}`,
              isVerified: true
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  console.log('[MachoBeast Auth] Google OAuth strategy registered');
} else {
  console.warn('[MachoBeast Auth] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set — Google OAuth disabled');
}

// ─── Facebook OAuth Strategy ──────────────────────────────────────────────────
if (ENV.FACEBOOK_APP_ID && ENV.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: ENV.FACEBOOK_APP_ID,
        clientSecret: ENV.FACEBOOK_APP_SECRET,
        callbackURL: `${ENV.SERVER_URL}/api/v1/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'emails', 'photos']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          let user = await User.findOne({
            $or: [{ facebookId: profile.id }, ...(email ? [{ email }] : [])]
          });

          if (user) {
            if (!user.facebookId) {
              user.facebookId = profile.id;
              user.provider = 'facebook';
              if (!user.avatar || user.avatar.includes('ui-avatars')) {
                user.avatar = profile.photos?.[0]?.value || user.avatar;
              }
              await user.save();
            }
          } else {
            const userName = profile.displayName || 'Facebook User';
            user = await User.create({
              name: userName,
              email: email || `fb_${profile.id}@machobeast.local`,
              facebookId: profile.id,
              provider: 'facebook',
              avatar:
                profile.photos?.[0]?.value ||
                `https://ui-avatars.com/api/?background=f59e0b&color=000&bold=true&name=${encodeURIComponent(userName)}`,
              isVerified: true
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  console.log('[MachoBeast Auth] Facebook OAuth strategy registered');
} else {
  console.warn('[MachoBeast Auth] FACEBOOK_APP_ID / FACEBOOK_APP_SECRET not set — Facebook OAuth disabled');
}

// Serialize/Deserialize (required by passport even with session:false)
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
