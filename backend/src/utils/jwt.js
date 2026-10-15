const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'staymate_super_secret_jwt_key_2026_mca_project', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Send JWT Token in HTTP-only Cookie and JSON response
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);

  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE, 10) || 7;
  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  // Strip password before returning
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    message,
    token, // Also provide in body for API clients, testing, Postman
    data: userObj,
  });
};

module.exports = {
  generateToken,
  sendTokenResponse,
};
