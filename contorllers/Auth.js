const bcrypt= require("bcrypt")
const z= require("zod")
const User= require("../models/User")
const OTP= require("../models/OTP")
const jwt= require("jsonwebtoken")
const otpGenerator= require("otp-generator")
const mailSender= require("../utils/otpMailSender")
require("dotenv").config()
const userSchema = z.object({
    username: z.string().min(1, "Username is required").trim(),
    email: z.string().min(1, "Email is required").email("Invalid email format").trim(),
    password: z.string().min(6, "Password is required of minimum 6 length"),
    otp: z.string().length(6, "OTP must be exactly 6 nu,bers")
});
exports.signUp= async(req, res)=>{
    try{
        const {
            username,
            email,
            password,
            otp
        }= req.body;
        const validation= userSchema.safeParse({username, email, password, otp});
        if(!validation.success){
            return res.status(400).json({
                success: false,
                message: validation.error
            })
        }
        const existingUser= await User.findOne({
            email: email,
            username: username
        })
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "This username, email pair is already in use, Please try with different username, email."
            })
        }
        const otpResponse= await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(otpResponse)
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
        const hashedPassword= await bcrypt.hash(password, 10);
        const newUser= await User.create({
            email: email,
            username: username,
            password: hashedPassword
        })
        return res.status(200).json({
            success: true,
            user: newUser,
            message: "User created successfully"
        })
    }catch(error){
        console.error("Error while sign-up............", error.message);
        return res.status(500).json({
            success: false,
            message: "User failed to sign-up. Internal Server Error"
        })
    }
}

exports.sendOtp= async(req, res)=>{
    try {
        const {email}= req.body;
        const existingUser= await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "This email is already in use"
            })
        }
        var otp= otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        const result= await OTP.findOne({otp: otp})
        console.log("This otp is generated from otp generator function...........")
        while(result){
            otp= otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
        }
        const optPayload= {email, otp};
        const newOtp= await OTP.create(optPayload)
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp: otp
        })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({
            success: false,
            message: `Failed to sent OTP..........${error.message}`
        })
    }
}

const loginSchema= z.object({
    username: z.string().min(1, "username is required").trim(),
    password: z.string().min(6, "Password must minimum of 6 characters")
})
exports.login= async(req, res)=>{
    try{
        const {username, password}= req.body;
        const loginValidation= loginSchema.safeParse({username, password});

        if(!loginValidation.success){
            return res.status(400).json({
                success: false,
                message: loginValidation.error.errors
            })
        }
        const user= await User.findOne({username});
        
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered. Please sign-up to continue"
            })
        }
        let token="";
        if(await bcrypt.compare(password, user.password)){
            
            token= jwt.sign(
                {email: user.email, username: user.username},
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h"
                }
            )
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            })
        }
        user.token= token;
        user.password= undefined;
        const options={
            expires: new Date(Date.now()+3*24*60*60*1000),
            httpOnly: true,
        }
        return res.cookie("token", token, options).status(200).json({
            success: true,
            message:"User login successfully",
            token: token,
        })

    }catch(error){
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to login, please try again later.'
        })
    }
}