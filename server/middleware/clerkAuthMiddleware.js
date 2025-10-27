// server/middleware/clerkAuthMiddleware.js

// ⚠️ FIX: Import the correct package you have installed in package.json
import { ClerkExpressRequireAuth } from '@clerk/express'; 

// Middleware to protect user routes using Clerk.
// ClerkExpressRequireAuth will automatically verify the JWT in the Authorization header 
// and populate req.auth with the necessary user data, resolving the "Cannot read properties of undefined (reading 'userId')" error.
export const protectUser = ClerkExpressRequireAuth({});