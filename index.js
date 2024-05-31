const express= require("express")
const app= express();
const dotenv= require("dotenv")
const database= require("./config/database");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");
const rateLimit= require("./utils/rateLimit")
dotenv.config();
database.connect();
app.use(express.json());
app.use(cookieParser())
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
const PORT= process.env.PORT;

app.use("/api/v1",router)
app.use(rateLimit);
app.get("/", (req, res)=>{
    res.send("Welcome from server")
})
app.listen(PORT, ()=>{
    console.log("Server is connected at ", PORT)
})