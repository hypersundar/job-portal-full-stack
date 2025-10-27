// server/middleware/clerkAuthMiddleware.js

import { clerkClient } from '@clerk/clerk-sdk-node';

// Middleware to verify the Clerk JWT and populate req.auth
export const protectUser = async (req, res, next) => {
    try {
        // 1. Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Authorization token not provided.' });
        }
        
        const token = authHeader.split(' ')[1];
        
        // 2. Verify the token using Clerk's SDK
        const verifiedToken = await clerkClient.verifyToken(token);
        
        // 3. Populate req.auth with the user ID and other claims
        // Note: The structure of the Clerk payload is slightly different from req.auth.userId, 
        // so we'll explicitly map it.
        req.auth = { 
            userId: verifiedToken.userId, 
            sessionId: verifiedToken.sid 
        };

        next();
        
    } catch (error) {
        // Token verification failed (e.g., expired or invalid)
        res.status(401).json({ success: false, message: 'Token Invalid or Expired.' });
    }
}