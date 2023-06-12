const express = require("express")
const { connectDB } = require("./db")
const { userRouter } = require("./routes/user.routes")
const { postRouter } = require("./routes/post.routes")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())
app.use("/users",userRouter)
app.use("/posts",postRouter)

connectDB().then(()=>{
    app.listen(process.env.port,()=>{ 
        try {
            console.log(`Sever running at port ${process.env.port}`);
        } catch (error) {
            console.log(error);
            console.log("Something went wrong");

        }
    })
})