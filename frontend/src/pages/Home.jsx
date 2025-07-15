import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [todoData, setTodoData] = useState({
    title: '',
    description: '',
  });
  const [todos, setTodos] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodoData({
      ...todoData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending todo data:', todoData);
      const response = await axios.post('http://localhost:3000/api/todo/create', todoData);
      console.log('Create todo response:', response.data);
      setShowSuccess(true);
      setTodoData({ title: '', description: '' });
      fetchTodos();
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Create todo error:', err);
      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert('Failed to create todo. Please try again.');
      }
    }
  };

  const fetchTodos = async () => {
    try {
      console.log('Fetching todos...');
      const response = await axios.get('http://localhost:3000/api/todo/getAll');
      console.log('Fetch todos response:', response.data);
      setTodos(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      if (err.response?.status === 404) {
        setTodos([]);
      }
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
   <>
    {showSuccess && (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
        Todo created successfully!
      </div>
    )}
    
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
      <div className="px-4 py-2">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">To-Do List</h1>
      </div>
      
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
      
      <ul className="divide-y divide-gray-200 px-4">
        {todos.length > 0 ? (
          todos.map((todo, index) => (
            <li key={todo._id || index} className="py-4">
              <div className="flex items-center">
                <label className="ml-3 block text-gray-900">
                  <span className="text-lg font-medium">{todo.title}</span>
                  <span className="text-sm font-light text-gray-500 block">{todo.description}</span>
                </label>
              </div>
            </li>
          ))
        ) : (
          <li className="py-4">
            <div className="text-gray-500 text-center">No todos yet. Create one above!</div>
          </li>
        )}
      </ul>
    </div>
   </div>
   </>
  )
}
export default Home