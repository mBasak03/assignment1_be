const mongoose= require("mongoose")

const userSchema= new mongoose({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
})
module.exports= mongoose.model("User", userSchema);
