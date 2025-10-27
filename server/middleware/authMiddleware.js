import jwt from 'jsonwebtoken'
import Company from '../models/Company.js'

// Middleware ( Protect Company Routes )
export const protectCompany = async (req,res,next) => {

    // Getting Token Froms Headers
    const token = req.headers.token

    
    if (!token) {
        // Log the failure to Vercel
        console.error('PROTECT COMPANY FAIL: No token provided in headers.'); 
        return res.json({ success:false, message:'Not authorized, Login Again'})
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Find the company and save it to the request object
        const company = await Company.findById(decoded.id).select('-password')
        
        // ⚠️ CRITICAL CHECK: If company is null (ID was valid but company was deleted/not found)
        if (!company) {
             console.error(`PROTECT COMPANY FAIL: Company ID ${decoded.id} not found in database.`); 
             return res.json({ success:false, message:'Company not found or deleted.'});
        }
        
        req.company = company
        
        next()

    } catch (error) {
        // Log the token verification failure
        console.error('PROTECT COMPANY FAIL: JWT Verification failed.', error.message);
        res.json({success:false, message: error.message})
    }

}