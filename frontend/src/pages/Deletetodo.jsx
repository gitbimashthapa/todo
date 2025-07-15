import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Deletetodo = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/todo/getAll');
      setTodos(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!selectedTodo) {
      alert('Please select a todo to delete');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/api/todo/delete/${selectedTodo}`);
      setShowSuccess(true);
      setSelectedTodo('');
      fetchTodos();
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      alert('Failed to delete todo. Please try again.');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Todo deleted successfully!
        </div>
      )}
      
      <div className="min-h-screen bg-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Delete Todo
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleDelete}>
              <div>
                <label htmlFor="todoSelect" className="block text-sm font-medium text-gray-700">
                  Select Todo to Delete
                </label>
                <div className="mt-1">
                  <select
                    id="todoSelect"
                    name="todoSelect"
                    value={selectedTodo}
                    onChange={(e) => setSelectedTodo(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    required
                  >
                    <option value="">Choose a todo...</option>
                    {todos.map((todo) => (
                      <option key={todo._id} value={todo._id}>
                        {todo.title} - {todo.description?.substring(0, 50)}
                        {todo.description?.length > 50 ? '...' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete Todo
                </button>
              </div>
            </form>

            <div className="mt-6">
              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-teal-300 rounded-md shadow-sm text-sm font-medium text-teal-600 bg-white hover:bg-gray-50"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Deletetodo;
