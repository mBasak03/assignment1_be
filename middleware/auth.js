const jwt= require("jsonwebtoken");
const dotenv= require("dotenv");
const User= require("../models/User");
dotenv.config();

exports.authMiddleware= async(req, res, next)=>{
    try{
        const token= 
            req.cookies.token ||
            req.body.token ||
            req.header("Authorisation").replace("Bearer ", "");
        
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }
        try{
            const decode= await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user= decode;
        }catch(error){
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }
        next();
    }catch(error){
        return res.status(401).json({
            success: false,
            message: "Something went wrong when validating token"
        })
    }
}