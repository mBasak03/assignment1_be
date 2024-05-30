const mongoose= require("mongoose");
require("dotenv").config();
const DATABASE_URL= process.env.DATABASE_URL;

exports.connect= ()=>{
    mongoose.connect(DATABASE_URL)
    .then(console.log("Database is connected successfully...."))
    .catch((error)=>{
        console.log("Failed to connnect to database")
        console.error(error.message);
        process.exit(1);
    })
}
