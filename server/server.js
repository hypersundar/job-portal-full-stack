// server/server.js

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import companyRoutes from './routes/companyRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { clerkWebhooks } from './controllers/webhooks.js'

// App Config
const app = express()
const port = process.env.PORT || 5000

// DB Connection
connectDB()

// ----------------------------------------------------------------
// ⚠️ FIX 1: CORS Middleware (Moved to the top to ensure headers are sent)
// ----------------------------------------------------------------
// By default, cors() allows all origins ('*'). This must run before any other middleware.
app.use(cors()) 

// ----------------------------------------------------------------
// FIX 2: WEBHOOK BODY PARSING CONFLICT (Previous fix, keep this order)
// ----------------------------------------------------------------
// This specific route must use the raw body parser.
app.post('/api/webhooks', express.raw({ type: 'application/json' }), clerkWebhooks)

// Middleware (for all other routes)
// This must stay after the webhook fix.
app.use(express.json()) 

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