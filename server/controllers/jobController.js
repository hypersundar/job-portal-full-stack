import Job from "../models/Job.js"

// Add Job
export const addJob = async (req, res) => {
    
    // ⚠️ FIX: Get the company ID from the token established by the protectCompany middleware
    const companyId = req.company._id; 

    const { title, description, category, location, level, salary } = req.body;

    // Basic validation
    if (!title || !description || !category || !location || !level || !salary) {
        return res.json({ success: false, message: 'Please enter all required fields.' });
    }

    try {
        const job = await Job.create({
            companyId, // This is the verified ObjectId Mongoose expects
            title,
            description,
            category,
            location,
            level,
            salary,
            date: Date.now()
        })
        res.json({ success: true, message: 'Job added successfully' })
    } catch (error) {
        // If the Cast to ObjectId error was happening here, this ensures the correct ID is used.
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
        res.json({ success: false, message: error.message })
    }
}