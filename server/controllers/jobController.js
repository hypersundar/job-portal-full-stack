import Job from "../models/Job.js"
import mongoose from "mongoose"

// Add Job (Aliased from companyController.js in the jobRoutes)
export const addJob = async (req, res) => {
    
    // 1. Get the verified companyId from the middleware
    const companyId = req.company?._id; 
    
    if (!companyId) {
         console.error("ADD JOB FAIL: Authorization failed. Company ID missing from token.");
         return res.status(401).json({ success: false, message: 'Authorization failed. Company ID missing.' });
    }

    // 2. Safely exclude the rogue _id field from the request body
    const { _id: rogueId, ...jobData } = req.body; 

    // Explicitly pull only the valid body fields
    const { 
        title, 
        description, 
        category, 
        location, 
        level, 
        salary 
    } = jobData;

    // Basic validation
    if (!title || !description || !category || !location || !level || !salary) {
        return res.json({ success: false, message: 'Please enter all required fields.' });
    }

    try {
        const job = await Job.create({
            companyId: companyId, // Verified ID
            title,
            description,
            category,
            location,
            level,
            salary,
            date: Date.now()
        })
        res.json({ success: true, message: 'Job added successfully', job: job })
    } catch (error) {
        console.error("JOB CREATION FAILED:", error.message);
        res.json({ success: false, message: error.message })
    }
}


// Get All Jobs
export const getJobs = async (req, res) => {
    try {

        const jobs = await Job.find({ visible: true })
            .populate({ path: 'companyId', select: '-password' })

        res.json({ success: true, jobs })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Single Job Using JobID
export const getJobById = async (req, res) => {
    try {
        const { id } = req.params

        // Use Mongoose's isValidObjectId for robust validation
        if (!id || !mongoose.isValidObjectId(id)) {
            console.log(`GET JOB BY ID FAILED: Invalid or missing ID: ${id}`);
            return res.json({ success: false, message: 'Invalid Job ID provided.' });
        }

        const job = await Job.findById(id)
            .populate({
                path: 'companyId',
                select: '-password'
            })

        if (!job) {
            return res.json({
                success: false,
                message: 'Job not found'
            })
        }

        res.json({
            success: true,
            job
        })

    } catch (error) {
        // Log the error but return a clean JSON response
        console.error("GET JOB BY ID CRASH:", error.message);
        res.json({ success: false, message: error.message })
    }
}