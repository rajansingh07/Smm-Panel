const dotenv = require('dotenv');
const path = require('path');

// Load env vars - look in backend root directory (two levels up from config folder)
dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  cookieExpire: parseInt(process.env.COOKIE_EXPIRE) || 7,
  smmProvider: {
    url: process.env.SMM_PROVIDER_URL,
    apiKey: process.env.SMM_PROVIDER_API_KEY,
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
