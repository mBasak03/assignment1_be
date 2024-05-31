const rateLimiter= require("express-rate-limit")

const rateLimit= rateLimiter({
    windowMs: 15 * 60 * 1000,
	limit: 100, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false,
})

module.exports= rateLimit;