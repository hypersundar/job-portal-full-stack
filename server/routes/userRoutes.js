import express from 'express'
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from '../controllers/userController.js'
import upload from '../config/multer.js'
// NOTE: Assuming the new middleware file is here
import { protectUser } from '../middleware/clerkAuthMiddleware.js' 


const router = express.Router()

// All these user routes now use protectUser middleware
// Get user Data
router.get('/user', protectUser, getUserData)

// Apply for a job
router.post('/apply', protectUser, applyForJob)

// Get applied jobs data
router.get('/applications', protectUser, getUserJobApplications)

// Update user profile (resume)
router.post('/update-resume', protectUser, upload.single('resume'), updateUserResume)

export default router;