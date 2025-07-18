import User from "../model/userModel.js"; //from the model
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import errorHandler from "../services/errorhandler.js";

//User registration
export const userRegistration = errorHandler(async (req, res) => {
    const { username, email, password, role } = req.body; 
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, password must required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(404).json({ message: "Email is already register!" })
    }

    const hashedPassword = await bcrypt.hash(password, 14); // password hashing   
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role
    })
    res.status(200).json({ message: "User register successfully", data: newUser })
});


//Login
export const userLogin = errorHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "email, password must required" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        return res.status(404).json({ message: "User not found" })
    }

    const ismatch = await bcrypt.compare(password, existingUser.password);

    if (!ismatch) {
        return res.status(404).json({ message: "Password not matched" })
    }

    const payload = { id: existingUser.id, role: existingUser.role }
    const token = jwt.sign(payload, process.env.JWT_SECRETE, { expiresIn: "1h" });
    
    res.status(200).json({ message: "User login successfull", token, data: existingUser })
});

// get all the users
export const getAllUsers = errorHandler(async (req, res) => {
    const user = await User.find();
    if(!user){
        res.status(400).json({ message: "User not found"});
    }
    res.status(200).json({ message: "Successfully get all the users", data: user });
});

//fetch single users
export const singleUser = errorHandler(async (req, res) => {
    const { id } = req.params;
    console.log("Id from the postman : ", id)
    const users = await User.findById(id);
    if(!users){
        return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Single user fetch successfully", data:users})
});


//user profile
export const userProfile = errorHandler(async (req, res) => {
    const id = req.user.id;
    const user = await User.findById(id);
    if(!user){
        return res.status(400).json({message: " User not found"})
    }
     res.status(200).json({ message: "User profile fetch successfully", data:user})
});


//update  userProfile
export const updateUser = errorHandler(async (req, res) => {
    const { id } = req.params;
    const {username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password must required" });
    }
    const existingUser = await User.findOne({ username });
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({ message: "User updated successfully", data: user })
});


//delete user
export const deleteUser = errorHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
     if(!user){
        return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully"})
});
