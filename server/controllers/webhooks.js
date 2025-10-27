import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
    
    // 1. Get the raw body as a string from the Buffer (set by express.raw)
    const payload = req.body.toString();
    
    // 2. Parse the payload now to get data and type for the switch case
    const { data, type } = JSON.parse(payload)

    try {

        // Create a Svix instance with clerk webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // 3. Verifying Headers with the CORRECT RAW PAYLOAD STRING
        await whook.verify(payload, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        // Switch Cases for differernt Events
        switch (type) {
            case 'user.created': {
                console.log('CLERK WEBHOOK: Attempting to create user', data.id); // Log to Vercel
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: ''
                }
                await User.create(userData) // Database write
                console.log('CLERK WEBHOOK: User created successfully', data.id); // Log success
                res.status(200).json({}) // Send 200 OK to Clerk
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.status(200).json({})
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.status(200).json({})
                break;
            }
            default:
                res.status(200).json({})
                break;
        }

    } catch (error) {
        // ⚠️ CRITICAL: Log the error in Vercel logs for visibility
        console.error("CLERK WEBHOOK ERROR: Signature Verification Failed or DB Write Error:", error.message);
        
        // Always return 200 OK to Clerk even if verification fails 
        // to prevent Clerk from retrying the failed webhook endlessly.
        res.status(200).json({ success: false, message: "Webhook processing error." })
    }
}