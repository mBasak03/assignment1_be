const z= require("zod");
const bcrypt= require("bcrypt")
const User= require("../models/User");
const OTP = require("../models/OTP");
const emailTemplate= require("../mail/templates/emailVerificationTemplate")
const otpGenerator= require("otp-generator");
const mailSender = require("../utils/otpMailSender");

exports.sentResetPasswordOtp= async(req, res)=>{
    const email= req.body.email;

    const emailSchema= z.object({
        email: z.string().email("This is not valid email format")
    })

    const result= emailSchema.safeParse({email: email})

    if(!result.success){
        return res.json({
            success: false,
            message: result.error.errors[0].message
        })
    }

    try {
        const existingUser= await User.findOne({email: email})

        if(!existingUser){
            return res.status(404).json({
                success: false,
                message: "User not found, Please Sign-up"
            })
        }

        var otp= otpGenerator.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        const result= await OTP.findOne({otp})
        console.log("This otp is generated from otp generator function...........")

        while(result){
            otp= otpGenerator.generate(4, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            result= await OTP.findOne({otp})
        }

        const optPayload= {email, otp};
        const newOtp= await OTP.create(optPayload);

       
        

        return res.status(200).json({
            success: true,
            message: "Email sent successfully"
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to sent email........"
        })
    }
}


const changePasswordSchema= z.object({
    otp: z.string().regex(/^\d{4}$/, { message: "OTP must be exactly 4 digits" }),
    newPassword: z.string().min(6, {message: "Password must be minimum of 6 characters"}),
    email: z.string().email("This is not valid email format")
})
exports.resetPassword= async(req, res)=>{
    const {otp, email, newPassword}= req.body;
    const validation= changePasswordSchema.safeParse({otp, newPassword, email})

    if(!validation.success){
        return res.status(400).json({
            success: false,
            message: validation.error.errors
        })
    }

    try{
        const user= await User.findOne({email:email})

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const otpResponse= await OTP.find({email}).sort({createdAt:-1}).limit(1);
        
        if (otpResponse.length === 0) {
            // OTP not found for the email
            return res.status(400).json({
              success: false,
              message: "The OTP is not valid",
            })
          } else if (otp !== otpResponse[0].otp) {
            // Invalid OTP
            return res.status(400).json({
              success: false,
              message: "The OTP is not valid",
            })
        }

        const hashedPassword= await bcrypt.hash(newPassword, 10);
        
        await User.findByIdAndUpdate(
            user._id,
            {
                password: hashedPassword
            },
            {new: true}
        )
        return res.status(200).json({
            success: true,
            message: "Your password has been reset successfully",
        })

    }catch(error){
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to reset password"
        })
    }
}