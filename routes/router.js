const express= require("express")
const router= express.Router()
const { sendOtp, signUp, login } = require("../contorllers/Auth")
const { createPost, getAllPosts } = require("../contorllers/postController")
const { authMiddleware } = require("../middleware/auth")
const { sentResetPasswordOtp, resetPassword } = require("../contorllers/resetPasswordController")

router.post("/send-otp", sendOtp)
router.post("/sign-up", signUp)
router.post("/sign-in", login)
router.post("/create-post", authMiddleware, createPost)
router.get("/posts", authMiddleware, getAllPosts)
router.post("/reset-password-otp", sentResetPasswordOtp)
router.post("/reset-password", resetPassword)


module.exports= router;