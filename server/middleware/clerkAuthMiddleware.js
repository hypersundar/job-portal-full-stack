// server/middleware/clerkAuthMiddleware.js

// FIX: Use the correct named export 'requireAuth' from @clerk/express
import { requireAuth } from '@clerk/express'; 

// Middleware to protect user routes using Clerk.
export const protectUser = requireAuth({});