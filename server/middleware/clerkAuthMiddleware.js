// server/middleware/clerkAuthMiddleware.js

// ⚠️ FIX: Use the correct named export 'requireAuth'
import { requireAuth } from '@clerk/express'; 

// Middleware to protect user routes using Clerk.
// requireAuth is the function that verifies the JWT and populates req.auth.
export const protectUser = requireAuth({});