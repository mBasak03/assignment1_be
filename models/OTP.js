const mongoose= require("mongoose")
const mailSender= require("../utils/otpMailSender")
const emailTemplate= require("../mail/templates/emailVerificationTemplate")

const OTPSchema= new mongoose({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*5,
    }
})
async function sendVerificationEmail(email, otp){
    try{
        const mailResponse= await mailSender(
            email,
            "Verification Email",
            emailTemplate(otp)
        )
        console.log("Email Sent successfully", mailResponse.response)
    }catch(error){
        console.error("Error occurred while sending email..........", error.message)
    }
}
OTPSchema.pre("save", async (next)=>{
    console.log("New Document saved to database............")
    if(this.isNew){
        await sendVerificationEmail(this.email, this.otp)
    }
    next()
})
const OTP= mongoose.model("OTP", OTPSchema)
module.exports= OTP;