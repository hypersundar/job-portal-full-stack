// server/middleware/clerkAuthMiddleware.js

// ⚠️ We use the package you have installed: @clerk/express
import { ClerkExpressRequireAuth } from '@clerk/express';

// Middleware to protect user routes using Clerk
export const protectUser = ClerkExpressRequireAuth({
    // Configuration to ensure the token verification is handled
    // by the Clerk SDK, which will automatically extract the userId.
    // We don't need custom logic here, ClerkExpressRequireAuth handles it.
});

/* // Note: If the above simple export fails to set req.auth.userId correctly, 
// you may need to wrap it like this for Mongoose models to work:

export const protectUser = (req, res, next) => {
    // Call the Clerk middleware function
    ClerkExpressRequireAuth({})(req, res, (err) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Authorization failed.' });
        }
        
        // After successful auth, Clerk populates req.auth or similar.
        // We ensure req.auth.userId is available for your controller (getUserData).
        // req.auth should be populated by Clerk's middleware.
        if (req.auth && req.auth.userId) {
            next();
        } else {
             // Fallback if req.auth isn't populated as expected
             return res.status(401).json({ success: false, message: 'Authorization failed: User ID not found in token.' });
        }
    });
};
*/