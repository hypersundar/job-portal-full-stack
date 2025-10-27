import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import companyRoutes from './routes/companyRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { clerkWebhooks } from './controllers/webhooks.js'
// If you are using the Clerk middleware globally, import it here:
// import { clerkMiddleware } from '@clerk/express' 


// App Config
const app = express()
const port = process.env.PORT || 5000

// DB Connection
connectDB()

// ----------------------------------------------------------------
// FIX 1: CORS Middleware (MUST run first)
// ----------------------------------------------------------------
app.use(cors()) 

// ----------------------------------------------------------------
// FIX 2: WEBHOOK ROUTE - Must capture raw body and run before express.json()
// This fixes Clerk webhook signature verification.
app.post('/api/webhooks', express.raw({ type: 'application/json', verify: (req, res, buf) => { req.rawBody = buf; } }), clerkWebhooks)
// ----------------------------------------------------------------

// Middleware (for all other routes)
app.use(express.json()) // Global JSON parsing
// app.use(clerkMiddleware()) 


// Routes
app.use('/api/company', companyRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes)

// Default Route
app.get('/', (req, res) => {
    res.send('API Working')
})


// Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`))