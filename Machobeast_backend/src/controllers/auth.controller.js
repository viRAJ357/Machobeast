import { User } from '../models/user.model.js';
import { generateToken } from '../utils/generateToken.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ENV } from '../config/env.js';

// Helper to infer Indian city from 6-digit postal code
export const inferCityFromPincode = (pincode) => {
  const pin = String(pincode || '').trim();
  if (pin.startsWith('11')) return 'New Delhi';
  if (pin.startsWith('12') || pin.startsWith('13')) return 'Gurugram';
  if (pin.startsWith('14') || pin.startsWith('15') || pin.startsWith('16')) return 'Chandigarh';
  if (pin.startsWith('20')) return 'Noida';
  if (pin.startsWith('22')) return 'Lucknow';
  if (pin.startsWith('30')) return 'Jaipur';
  if (pin.startsWith('38')) return 'Ahmedabad';
  if (pin.startsWith('40')) return 'Mumbai';
  if (pin.startsWith('41')) return 'Pune';
  if (pin.startsWith('45')) return 'Indore';
  if (pin.startsWith('50')) return 'Hyderabad';
  if (pin.startsWith('56')) return 'Bengaluru';
  if (pin.startsWith('60')) return 'Chennai';
  if (pin.startsWith('68')) return 'Kochi';
  if (pin.startsWith('70')) return 'Kolkata';
  if (pin.startsWith('80')) return 'Patna';
  return 'India';
};

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
          deliveryPincode: user.deliveryPincode || '400001',
          deliveryCity: user.deliveryCity || 'Mumbai',
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

// @desc    Update current user's delivery location / pincode
// @route   PUT /api/v1/auth/location
// @access  Private
export const updateDeliveryLocation = async (req, res, next) => {
  try {
    const { pincode, city } = req.body;
    if (!pincode) {
      return next(new ApiError(400, 'Pincode is required'));
    }

    const cleanPin = String(pincode).trim();
    const resolvedCity = city ? String(city).trim() : inferCityFromPincode(cleanPin);

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    user.deliveryPincode = cleanPin;
    user.deliveryCity = resolvedCity;
    await user.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          deliveryPincode: user.deliveryPincode,
          deliveryCity: user.deliveryCity
        },
        'Delivery location updated in database successfully'
      )
    );
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
        deliveryPincode: user.deliveryPincode || '400001',
        deliveryCity: user.deliveryCity || 'Mumbai',
        isVerified: user.isVerified
      })
    );

    res.redirect(`${ENV.CLIENT_URL}/oauth-callback?token=${token}&user=${userData}`);
  } catch (error) {
    res.redirect(`${ENV.CLIENT_URL}/login?error=oauth_failed`);
  }
};
