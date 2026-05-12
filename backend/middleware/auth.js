// middleware/auth.js - Clerk JWT Verification Middleware
// Protects routes so only logged-in users can access them

const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// This middleware verifies the Clerk JWT token from the request header
// If token is invalid or missing, it returns 401 Unauthorized
const requireAuth = ClerkExpressRequireAuth();

// Helper middleware that attaches userId to req for easy access
const attachUserId = (req, res, next) => {
  // Clerk puts the user info in req.auth after verification
  if (req.auth && req.auth.userId) {
    req.userId = req.auth.userId;
  }
  next();
};

module.exports = { requireAuth, attachUserId };
