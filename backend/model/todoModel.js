import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
}, { timestamps: true })

const ToDo = mongoose.model("ToDo", todoSchema);
export default ToDo


