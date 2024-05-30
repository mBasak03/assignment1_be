const express= require("express")
const router= express.Router()
const { sendOtp, signUp, login } = require("../contorllers/Auth")

router.post("/send-otp", sendOtp)
router.post("/sign-up", signUp)
router.post("/sign-in", login)

module.exports= router;