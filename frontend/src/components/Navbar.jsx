import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  // Debug: Log authentication state
  console.log('Navbar - isLoggedIn:', isLoggedIn, 'user:', user);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/todo/all/search?query=${encodeURIComponent(query)}`);
      setSearchResults(response.data.data || []);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
      setShowSearchResults(true);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    if (query.length > 2) {
      setTimeout(() => {
        if (searchQuery === query) {
          handleSearch(query);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const closeSearch = () => {
    setShowSearchResults(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-teal-600">TodoApp</h1>
            </Link>
            
            {isLoggedIn && (
              <div className="ml-8 flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm"
                >
                  Home
                </Link>
                <Link
                  to="/update-todo"
                  className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm"
                >
                  Update
                </Link>
                <Link
                  to="/delete-todo"
                  className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm"
                >
                  Delete
                </Link>
                
                {/* Search Bar aligned with navigation links */}
                <div ref={searchRef} className="relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onFocus={() => searchQuery.length > 2 && handleSearch(searchQuery)}
                      className="block w-48 pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  {/* Search Results Dropdown */}
                  {showSearchResults && (
                    <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {searchResults.length > 0 ? (
                        <>
                          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50 border-b">
                            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                          </div>
                          {searchResults.map((todo, index) => (
                            <div
                              key={todo._id || index}
                              className="cursor-pointer select-none relative py-2 px-3 hover:bg-gray-100"
                              onClick={() => {
                                navigate('/');
                                closeSearch();
                              }}
                            >
                              <div className="flex items-center">
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">{todo.title}</p>
                                  {todo.description && (
                                    <p className="text-sm text-gray-500 truncate">{todo.description}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                          No todos found matching "{searchQuery}"
                        </div>
                      )}
                      <div className="border-t border-gray-200">
                        <button
                          onClick={closeSearch}
                          className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:bg-gray-50"
                        >
                          Close search results
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-gray-700 text-sm">
                  {user?.username || user?.email || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-teal-600 hover:text-teal-500 px-3 py-2 rounded-md text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
