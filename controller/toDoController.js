import ToDo from "../model/todoModel.js";


//create todo API
export const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;  //postman  ....frontend

        //status code 
        if (!title || !description) {
            return res.status(400).json({ message: "Title and the description must required" });
        }
        const existingTodo = await ToDo.findOne({ title });
        if (existingTodo) {
            return res.status(404).json({ message: "Title already exist" });
        }

        const todo = await ToDo.create({
            title, description
        });
        res.status(200).json({ message: "Todo created successfully", data: todo })

    } catch (err) {
        res.status(500).json({ error: "Internal server error" });

    }
}


//get/read todo
export const getTodo = async (req, res) => {
    try {
        const todo = await ToDo.find();
        res.status(200).json({ message: "Todo created successfully", data: todo });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}


//fetch single todo
export const singleTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await ToDo.findById(id);
        if(!todo){
            return res.status(400).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "Single todo fetch successfully", data:todo})
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}


//update  API
export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;  //postman  ....frontend

        //status code 
        if (!title || !description) {
            return res.status(400).json({ message: "Title and desc must required" });
        }

        const existingTodo = await ToDo.findOne({ title });
        if (existingTodo) {
            return res.status(404).json({ message: "Title already exist" });
        }

        const todo = await ToDo.findByIdAndUpdate(id, req.body, { new: true });

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
            return res.status(400).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "Todo deleted successfully"})
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });

    }
}





