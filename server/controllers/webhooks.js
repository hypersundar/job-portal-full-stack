import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
    
    // 1. Get the raw body as a string from the Buffer (saved by express.raw middleware)
    const payload = req.rawBody.toString('utf8');
    
    // 2. Get the headers and webhook secret
    const headers = req.headers;
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    try {
        // 3. Verifying Headers with the raw payload string
        await whook.verify(payload, {
            "svix-id": headers["svix-id"],
            "svix-timestamp": headers["svix-timestamp"],
            "svix-signature": headers["svix-signature"]
        })

        // 4. Parse the payload into JSON object AFTER successful verification
        const event = JSON.parse(payload);
        const { data, type } = event;

        // Switch Cases for differernt Events
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: (data.first_name || '') + " " + (data.last_name || ''),
                    image: data.image_url,
                    resume: ''
                }
                await User.create(userData) // Database write
                res.status(200).json({}) // Must return 200 OK
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: (data.first_name || '') + " " + (data.last_name || ''),
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
        // ⚠️ CRITICAL: Log the error in Vercel logs for debugging signature issues
        console.error("CLERK WEBHOOK CRITICAL FAILURE:", error.message);
        
        // 5. Always return 200 OK to Clerk to prevent retries, even if processing fails.
        // The failure is logged internally, but the external status is successful.
        res.status(200).json({ success: false, message: "Webhook processing error on server." })
    }
}