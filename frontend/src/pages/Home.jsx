import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiHandler from '../utils/apiHandler';

const Home = () => {
  const navigate = useNavigate();
  const [todoData, setTodoData] = useState({
    title: '',
    description: '',
  });
  const [todos, setTodos] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodoData({
      ...todoData,
      [name]: value,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditData({
      title: todo.title,
      description: todo.description || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ title: '', description: '' });
  };

  const saveEdit = async () => {
    if (!ApiHandler.isAuthenticated()) {
      alert('Please login to update todos');
      return;
    }

    const result = await ApiHandler.patch(`/todo/update/${editingId}`, editData, navigate);
    
    if (result.success) {
      setEditingId(null);
      setEditData({ title: '', description: '' });
      fetchTodos();
      alert('Todo updated successfully!');
    } else {
      alert(result.error || 'Failed to update todo.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ApiHandler.isAuthenticated()) {
      alert('Please login to create todos');
      navigate('/login');
      return;
    }

    const result = await ApiHandler.post('/todo/create', todoData, navigate);
    
    if (result.success) {
      setTodoData({ title: '', description: '' });
      fetchTodos();
      alert('Todo created successfully!');
    } else {
      alert(result.error || 'Failed to create todo.');
    }
  };

  const handleDelete = async (todoId) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    if (!ApiHandler.isAuthenticated()) {
      alert('Please login to delete todos');
      return;
    }

    const result = await ApiHandler.delete(`/todo/delete/${todoId}`, navigate);
    
    if (result.success) {
      fetchTodos();
      alert('Todo deleted successfully!');
    } else {
      alert(result.error || 'Failed to delete todo.');
    }
  };

  const fetchTodos = async () => {
    if (!ApiHandler.isAuthenticated()) {
      setTodos([]);
      return;
    }

    const result = await ApiHandler.get('/todo/getAll', navigate);
    
    if (result.success) {
      setTodos(result.data.data || []);
    } else {
      setTodos([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchTodos();
    } else {
      setIsLoggedIn(false);
      setTodos([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
        <div className="px-4 py-2">
          <h1 className="text-gray-800 font-bold text-2xl uppercase">To-Do List</h1>
        </div>
        
        {isLoggedIn ? (
          <form className="w-full max-w-sm mx-auto px-4 py-2" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center border-b-2 border-teal-500 py-2">
                <input
                  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="text" 
                  placeholder="Add a task title"
                  name="title"
                  value={todoData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex items-center border-b-2 border-teal-500 py-2">
                <input
                  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="text" 
                  placeholder="Add description"
                  name="description"
                  value={todoData.description}
                  onChange={handleChange}
                />
              </div>
              
              <button
                className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-2 px-4 rounded w-full"
                type="submit">
                Create Todo
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 px-4">
            <p className="text-gray-600 mb-4">Please login to create and manage your todos</p>
            <div className="space-x-4">
              <Link
                to="/login"
                className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="border border-teal-600 text-teal-600 px-4 py-2 rounded-md text-sm hover:bg-teal-50"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
        
        <ul className="divide-y divide-gray-200 px-4">
          {isLoggedIn && todos.length > 0 ? (
            todos.map((todo, index) => (
              <li key={todo._id || index} className="py-4">
                {editingId === todo._id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Todo title"
                    />
                    <input
                      type="text"
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Todo description"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={saveEdit}
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-lg font-medium block text-gray-900">
                        {todo.title}
                      </span>
                      <span className="text-sm block text-gray-500">
                        {todo.description}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit(todo)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          ) : isLoggedIn ? (
            <li className="py-4">
              <div className="text-gray-500 text-center">No todos yet. Create one above!</div>
            </li>
          ) : (
            <li className="py-4">
              <div className="text-gray-500 text-center">Welcome to TodoApp! Please login to see your todos.</div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;