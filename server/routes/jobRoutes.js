import express from 'express'
import { getJobById, getJobs, addJob } from '../controllers/jobController.js';
import { protectCompany } from '../middleware/authMiddleware.js'; // Import the JWT middleware

const router = express.Router()

// Route to get all jobs data
router.get('/', getJobs)

// Route to add a new job (Protected by JWT)
router.post('/add-job', protectCompany, addJob)

// Route to get a single job by ID
router.get('/:id', getJobById)


export default router;