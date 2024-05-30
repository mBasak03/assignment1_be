const mongoose= require("mongoose")
const postSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})
module.exports= mongoose.model("Post", postSchema);