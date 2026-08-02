import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 register/login requests per 15 minutes
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
});

export const inquiryRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 5 inquiry submissions per 5 minutes
  message: {
    success: false,
    message: 'Too many inquiries submitted from this connection. Please wait 5 minutes before submitting another.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
