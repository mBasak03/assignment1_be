const express= require("express")
const app= express();
const dotenv= require("dotenv")
const database= require("./config/database");
const router = require("./routes/router");

dotenv.config();
database.connect();
app.use(express.json());
const PORT= process.env.PORT;

app.use("/api/v1",router)
app.get("/", (req, res)=>{
    res.send("Welcome from server")
})
app.listen(PORT, ()=>{
    console.log("Server is connected at ", PORT)
})