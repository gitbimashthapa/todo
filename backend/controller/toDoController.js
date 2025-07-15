import ToDo from "../model/todoModel.js";

//create todo
export const createTodo = async (req, res) => {
    try {
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

    } catch (err) {
        console.error('Create todo error:', err);
        res.status(500).json({ error: "Internal server error" });
    }
}


// get all todo
export const getTodo = async (req, res) => {
    try {
        const todo = await ToDo.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Todo created successfully", data: todo });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}

//findOne

//fetch single todo
export const singleTodo = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id){
             return res.status(400).json({ message: "Todo not found" });
        }

        const todo = await ToDo.findById(id);
        if(!todo){
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "Single todo fetch successfully", data:todo})
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}


//update  todo
export const updateTodo = async (req, res) => {
    try {
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

    } catch (err) {
        res.status(500).json({ error: "Internal server error" });

    }
}

//delete todo
export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Id must be required" });
        }
        const todo = await ToDo.findByIdAndDelete(id);
        if(!todo){
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "Todo deleted successfully"})
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });

    }
}

// search the todo
export const searchTodo= async(req, res)=>{
    try{
        const {query}=req.query;
        console.log("Query : ", query)
        if(!query){
           return res.status(400).json({message : "Query must be required"})
        }

        const todos= await ToDo.find({
            $or: [
                {title :  {$regex : query, $options : "i"}},
                {description :  {$regex : query, $options : "i"}},
            ]
        });

        if(todos.length===0){
            return res.status(404).json({message : "To do not found on this search"});
        }

        res.status(200).json({message : "Search result ", data : todos})
    }catch(err){
        res.status(500).json({error : "Internal server error"});

    }
}

