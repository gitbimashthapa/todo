import { Router } from "express";
import { createTodo, deleteTodo, getTodo, searchTodo, singleTodo, updateTodo } from "../controller/toDoController.js";
import { isAuthenticated, restrictTo, Role } from "../middleware/authMiddleware.js";

const router=Router();


router.route("/create").post(createTodo);

router.route("/getAll").get( getTodo);
router.route("/:id").get(singleTodo);
router.route("/update/:id").patch(updateTodo);
router.route("/delete/:id").delete(deleteTodo);


router.route("/all/search"). get( searchTodo);


export default router