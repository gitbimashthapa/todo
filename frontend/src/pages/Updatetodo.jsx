import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Updatetodo = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodoId, setSelectedTodoId] = useState('');
  const [todoData, setTodoData] = useState({
    title: '',
    description: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/todo/getAll');
      setTodos(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
    }
  };

  const fetchSingleTodo = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/todo/${id}`);
      const todo = response.data.data;
      setTodoData({
        title: todo.title,
        description: todo.description || '',
      });
    } catch (err) {
      alert('Failed to load todo details. Please try again.');
    }
  };

  const handleTodoSelect = (e) => {
    const todoId = e.target.value;
    setSelectedTodoId(todoId);
    if (todoId) {
      fetchSingleTodo(todoId);
    } else {
      setTodoData({ title: '', description: '' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodoData({
      ...todoData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTodoId) {
      alert('Please select a todo to update');
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:3000/api/todo/update/${selectedTodoId}`, todoData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      alert('Failed to update todo. Please try again.');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Todo updated successfully!
        </div>
      )}
      
      <div className="min-h-screen bg-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Update Todo
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="todoSelect" className="block text-sm font-medium text-gray-700">
                  Select Todo to Update
                </label>
                <div className="mt-1">
                  <select
                    id="todoSelect"
                    name="todoSelect"
                    value={selectedTodoId}
                    onChange={handleTodoSelect}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    required
                  >
                    <option value="">Choose a todo...</option>
                    {todos.map((todo) => (
                      <option key={todo._id} value={todo._id}>
                        {todo.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedTodoId && (
                <>
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <div className="mt-1">
                      <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        value={todoData.title}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        placeholder="Enter todo title"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={todoData.description}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        placeholder="Enter todo description (optional)"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <button
                  type="submit"
                  disabled={!selectedTodoId}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Todo
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

export default Updatetodo;
