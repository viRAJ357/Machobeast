import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ENV } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this resource'));
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return next(new ApiError(401, 'User associated with this token no longer exists'));
    }
    next();
  } catch (error) {
    return next(new ApiError(401, 'Token verification failed or expired'));
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return next(new ApiError(403, 'Access denied. Administrator privileges required.'));
  }
};
