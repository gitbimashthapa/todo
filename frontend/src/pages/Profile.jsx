import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [todoCount, setTodoCount] = useState(0);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/profile", {
          headers: { Authorization: `${token}` }
        });
        setUser(response.data.data);
        setUsername(response.data.data.username);
      } catch (err) {
        console.log("Error on fetching the data");
        // If token is invalid, redirect to login
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    const fetchTodoCount = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/todo/getAll', {
          headers: { Authorization: `${token}` }
        });
        setTodoCount(response.data.data?.length || 0);
      } catch (err) {
        console.log("Error fetching todos");
        setTodoCount(0);
      }
    };

    fetchUserProfile();
    fetchTodoCount();
  }, [navigate]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `http://localhost:3000/api/updateUser/${user._id}`,
        { username },
        { headers: { Authorization: `${token}` } }
      );
      alert("Username updated successfully");
      setUser({ ...user, username });
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update username");
    }
  };

  if (!user) return (
    <div className="h-screen bg-blue-50 flex items-center justify-center">
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  );

  return (
    <div className="h-screen bg-blue-50 pt-12">
      {/* Card start */}
      <div className="max-w-sm mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="border-b px-4 pb-6">
          <div className="text-center my-4">
            <img 
              className="h-32 w-32 rounded-full border-4 border-white mx-auto my-4"
              src="https://randomuser.me/api/portraits/women/21.jpg" 
              alt="Profile" 
            />
            <div className="py-2">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    className="font-bold text-2xl text-gray-800 mb-1 text-center border-2 border-teal-500 rounded px-2 py-1"
                    autoFocus
                  />
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setUsername(user.username);
                      }}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 
                    className="font-bold text-2xl text-gray-800 mb-1 cursor-pointer hover:text-teal-600"
                    onClick={() => setIsEditing(true)}
                    title="Click to edit username"
                  >
                    {user.username}
                  </h3>
                  <div className="inline-flex text-gray-700 items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-1" fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path
                        d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                    </svg>
                    {user.email || 'Email not available'}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2 px-2">
            <Link
              to="/edit-profile"
              className="flex-1 rounded-full bg-teal-600 text-white antialiased font-bold hover:bg-teal-800 px-4 py-2 text-center"
            >
              Edit Profile
            </Link>
            <button
            
              className="flex-1 rounded-full border-2 border-gray-400 font-semibold text-black px-4 py-2 hover:bg-gray-50">
              Settings
            </button>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="flex gap-2 items-center text-gray-800 mb-4">
            <svg className="h-6 w-6 text-gray-600" fill="currentColor"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path
                d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z" />
            </svg>
            <span><strong className="text-black">{todoCount}</strong> Todo Tasks Created</span>
          </div>
        </div>
      </div>
      {/* Card end */}
    </div>
  );
};

export default Profile;