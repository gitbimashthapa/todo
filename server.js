import express from "express"
import connectDB from "./config/mongodb.js"; //import from the mongodb.js 

import userRoutes from "./routes/userRoutes.js" //import from the userRoutes
import toDoRoutes from "./routes/toDoRoutes.js" 

import dotenv from "dotenv"
dotenv.config();


const app=express();
const PORT= process.env.PORT || 3000;

app.use(express.json());

connectDB()//call the function from the mongodb.js

//Routes

// app.use("/register", (req, res)=>{
//     res.send("Register is test")
// })

app.use("/api", userRoutes)
app.use("/api/todo", toDoRoutes)


app.listen(PORT, ()=>{
    console.log(`Server is running on  the port ${PORT}`)   
})





// npm i nodemon