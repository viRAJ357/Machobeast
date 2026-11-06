import { User } from '../models/user.model.js';
import { generateToken } from '../utils/generateToken.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ENV } from '../config/env.js';

// Helper to set auth cookie + respond
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id, user.role);

  res.cookie('token', token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.status(statusCode).json(
    new ApiResponse(
      statusCode,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          provider: user.provider,
          isVerified: user.isVerified
        },
        token
      },
      message
    )
  );
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return next(new ApiError(400, 'Please provide name, email, and password'));
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return next(new ApiError(400, 'User with this email already exists'));
    }

    // Role safety: default to 'user' unless admin explicitly registers
    const userRole = role === 'admin' ? 'admin' : 'user';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: userRole,
      provider: 'local',
      avatar: `https://ui-avatars.com/api/?background=f59e0b&color=000&bold=true&name=${encodeURIComponent(name)}`
    });

    return sendTokenResponse(user, 201, res, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Please provide email and password'));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    // OAuth users trying to log in with password
    if (user.provider !== 'local' && !user.password) {
      return next(
        new ApiError(400, `This account uses ${user.provider} sign-in. Please use that method.`)
      );
    }

    if (!(await user.matchPassword(password))) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    return sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Public
export const logoutUser = async (req, res, next) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0)
    });

    return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/v1/auth/me
// @access  Private
export const getMeProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json(new ApiResponse(200, user, 'User profile fetched'));
  } catch (error) {
    next(error);
  }
};

// @desc    Handle OAuth callback — issue JWT and redirect to frontend
// @route   GET /api/v1/auth/google/callback  (called by Passport internally)
// @access  Internal
export const oAuthCallback = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`${ENV.CLIENT_URL}/login?error=oauth_failed`);
    }

    const token = generateToken(user._id, user.role);

    // Redirect to frontend with token + user info in query params
    const userData = encodeURIComponent(
      JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        provider: user.provider,
        isVerified: user.isVerified
      })
    );

    res.redirect(`${ENV.CLIENT_URL}/oauth-callback?token=${token}&user=${userData}`);
  } catch (error) {
    res.redirect(`${ENV.CLIENT_URL}/login?error=oauth_failed`);
  }
};
