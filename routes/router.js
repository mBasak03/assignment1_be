const express= require("express")
const router= express.Router()
const { sendOtp, signUp } = require("../contorllers/Auth")

router.post("/send-otp", sendOtp)
router.post("/sign-up", signUp)

module.exports= router;