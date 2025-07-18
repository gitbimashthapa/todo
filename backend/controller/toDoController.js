import ToDo from "../model/todoModel.js";
import errorHandler from "../services/errorhandler.js";

//create todo
export const createTodo = errorHandler(async (req, res) => {
    const { title, description } = req.body;  
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }
    
    const existingTodo = await ToDo.findOne({ title });
    if (existingTodo) {
        return res.status(409).json({ message: "Title already exists" });
    }
    
    const todo = await ToDo.create({
        title, 
        description: description || ''
    });
    res.status(201).json({ message: "Todo created successfully", data: todo })
});


// get all todo
export const getTodo = errorHandler(async (req, res) => {
    const todo = await ToDo.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Todo fetched successfully", data: todo });
});

//fetch single todo
export const singleTodo = errorHandler(async (req, res) => {
    const { id } = req.params;
    if(!id){
         return res.status(400).json({ message: "Todo ID is required" });
    }
    const todo = await ToDo.findById(id);
    if(!todo){
        return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Single todo fetch successfully", data: todo})
});


//update  todo
export const updateTodo = errorHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body; 

    //status code 
    if (!title || !description) {
        return res.status(400).json({ message: "Title and desc must required" });
    }

    // const existingTodo = await ToDo.findOne({ title });
    // if (existingTodo) {
    //     return res.status(404).json({ message: "Title already exist" });
    // }

    const todo = await ToDo.findByIdAndUpdate(id, req.body, { new: true });
    //const todo = await ToDo.findByIdAndUpdate(id, { title, description }, { new: true });

    res.status(200).json({ message: "Todo updated successfully", data: todo })
});

//delete todo
export const deleteTodo = errorHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Id must be required" });
    }
    const todo = await ToDo.findByIdAndDelete(id);
    if(!todo){
        return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully"})
});

// search the todo
export const searchTodo = errorHandler(async (req, res) => {
    const {query} = req.query;
    console.log("Query : ", query)
    if(!query){
       return res.status(400).json({message : "Query must be required"})
    }

    const todos = await ToDo.find({
        $or: [
            {title :  {$regex : query, $options : "i"}},
            {description :  {$regex : query, $options : "i"}},
        ]
    });

    if(todos.length === 0){
        return res.status(404).json({message : "To do not found on this search"});
    }

    res.status(200).json({message : "Search result ", data : todos})
});

