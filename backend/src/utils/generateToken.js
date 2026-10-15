const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId, role) => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'staymate_jwt_secret_fallback',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

module.exports = generateTokenAndSetCookie;
