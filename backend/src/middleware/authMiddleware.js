const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'Authentication token missing. Please log in.');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'staymate_jwt_secret_fallback'
    );

    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      return sendError(res, 401, 'User account no longer exists.');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Account has been deactivated. Please contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Session has expired. Please log in again.');
    }
    return sendError(res, 401, 'Invalid authentication token.');
  }
};

module.exports = { authenticate };
