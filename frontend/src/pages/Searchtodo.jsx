import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Searchtodo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert('Please enter a search query');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/todo/all/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data.data || []);
      setHasSearched(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setSearchResults([]);
      } else {
        alert('Failed to search todos. Please try again.');
      }
      setHasSearched(true);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Search Todos
            </h2>
          </div>

          <div className="mt-8">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="search"
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        placeholder="Search todos by title or description..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {hasSearched && (
            <div className="mt-8">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Search Results ({searchResults.length} found)
                  </h3>

                  {searchResults.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.map((todo, index) => (
                        <div key={todo._id || index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="text-lg font-medium text-gray-900">{todo.title}</h4>
                          {todo.description && (
                            <p className="mt-1 text-sm text-gray-600">{todo.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No todos found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-teal-300 rounded-md shadow-sm text-sm font-medium text-teal-600 bg-white hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Searchtodo;
