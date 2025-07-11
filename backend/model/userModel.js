import mongoose from "mongoose"; 

const userSchema= new mongoose.Schema({
    //collection=table
    //document=row
    //field=column
    username:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{type:String, enum:["user", "admin", "superAdmin"], default:"user"}
})

const User=mongoose.model("User", userSchema);
export default  User


