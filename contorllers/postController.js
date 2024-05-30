const User = require("../models/User");
const Post= require("../models/Post")

exports.createPost= async(req, res)=>{
    try{
        const username= req.user.username;
        let {title, description}= req.body;
        const user= await User.findOne({username:username})
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const newPost= await Post.create({
            title: title,
            description: description,
            uploadedBy: user.username
        })
        return res.status(200).json({
            success: true,
            message: "Post created successfully.",
            post: newPost
        })
    }catch(error){
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to create post",
        })
    }
}

exports.getAllPosts= async(req, res)=>{
    try{
        const username= req.user.username;
        const user= await User.findOne({username:username})
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const posts= await Post.find({});
        return res.status(200).json({
            success: true,
            message: "Fetched all posts successfully",
            posts: posts
        })
    }catch(error){
        console.error(error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch posts.",
        })
    }
}