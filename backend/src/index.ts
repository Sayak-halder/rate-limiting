// import express from 'express';

// const app = express(); // Initialize an Express application
// const PORT = 3000; // Define the port number to run the server

// app.use(express.json()); // Middleware to parse incoming JSON requests

// // An in-memory store to temporarily save OTPs associated with email addresses
// const otpStore: Record<string, string> = {};

// // Route to generate and log OTP for a given email
// app.post('/generate-otp', (req, res) => {
//     const email = req.body.email; // Extract email from the request body
    
//     // Check if the email is provided in the request
//     if (!email) {
//         return res.status(400).json({ message: "Email is required!" });
//     }

//     // Generate a 6-digit OTP and convert it to a string
//     const otp = Math.floor(10000 + Math.random() * 900000).toString();
//     otpStore[email] = otp; // Save the OTP in the in-memory store associated with the email

//     // Log the generated OTP to the console (for testing/debugging purposes)
//     console.log(`OTP for ${email}: ${otp}`);

//     // Send a success response to the client indicating that the OTP was generated and logged
//     res.status(200).json({ message: "OTP generated and logged!" });
// });

// // Route to reset the password using email, OTP, and new password
// app.post('/reset-password', (req, res) => {
//     const { email, otp, newPassword } = req.body; // Extract email, OTP, and new password from the request body

//     // Check if all required fields are provided in the request
//     if (!email || !otp || !newPassword) {
//         return res.status(400).json({ message: "Email, OTP, and New Password are required!" });
//     }

//     // Verify if the provided OTP matches the one stored for the given email
//     if (otpStore[email] === otp) {
//         // If the OTP matches, log the password reset action to the console
//         console.log(`Password for ${email} has been reset to: ${newPassword}`);
        
//         // Remove the OTP from the store after successful password reset
//         delete otpStore[email];

//         // Send a success response to the client indicating that the password has been reset
//         res.status(200).json({ message: "Password has been reset successfully" });
//     } else {
//         // If the OTP is invalid, send an unauthorized response to the client
//         res.status(401).json({ message: "Invalid OTP!" });
//     }
// });

// // Start the server and listen on the defined port
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });





// With rate Limiter

import express from 'express';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = 3000;

app.use(express.json());

// Rate limiter configuration
const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 OTP requests per windowMs
    message: 'Too many requests, please try again after 5 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 password reset requests per windowMs
    message: 'Too many password reset attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

// Store OTPs in a simple in-memory object
const otpStore: Record<string, string> = {};

// Endpoint to generate and log OTP with rate limiting
app.post('/generate-otp', otpLimiter, (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generates a 6-digit OTP
    otpStore[email] = otp;

    console.log(`OTP for ${email}: ${otp}`); // Log the OTP to the console
    res.status(200).json({ message: "OTP generated and logged" });
});

// Endpoint to reset password with rate limiting
app.post('/reset-password', passwordResetLimiter, (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }
    if (Number(otpStore[email]) === Number(otp)) {
        console.log(`Password for ${email} has been reset to: ${newPassword}`);
        delete otpStore[email]; // Clear the OTP after use
        res.status(200).json({ message: "Password has been reset successfully" });
    } else {
        res.status(401).json({ message: "Invalid OTP" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

