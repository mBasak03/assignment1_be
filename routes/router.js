const express= require("express")
const router= express.Router()
const { sendOtp, signUp, login } = require("../contorllers/Auth")
const { createPost, getAllPosts } = require("../contorllers/postController")
const { authMiddleware } = require("../middleware/auth")

router.post("/send-otp", sendOtp)
router.post("/sign-up", signUp)
router.post("/sign-in", login)
router.post("/create-post", authMiddleware, createPost)
router.get("/posts", authMiddleware, getAllPosts)

module.exports= router;