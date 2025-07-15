import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', userData);
      console.log('Login response:', response.data);
      
      // Backend returns: { message, token, data: userObject }
      // AuthContext expects: login(token, userData)
      if (response.data.token && response.data.data) {
        login(response.data.token, response.data.data);
        console.log('Login successful, token and user data saved');
      } else {
        console.error('Invalid response format:', response.data);
        alert('Login response format error');
        return;
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/'); // Redirect to home page after successful login
      }, 2000);
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 404) {
        if (err.response.data.message === 'User not found') {
          alert('No account found with this email. Please register first.');
        } else if (err.response.data.message === 'Password not matched') {
          alert('Incorrect password. Please try again.');
        } else {
          alert('Login endpoint not found. Please make sure the backend server is running on port 3000.');
        }
      } else if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert('Login failed. Please check your credentials and ensure the backend is running.');
      }
    }
  };

  return (
    <>
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          Login Successful!
        </div>
      )}

      <section className="bg-blue-50 min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={userData.email}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5" 
                    placeholder="name@company.com" 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5" 
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input 
                        id="remember" 
                        aria-describedby="remember" 
                        type="checkbox" 
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-teal-300"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="font-light text-gray-500">Remember me</label>
                    </div>
                  </div>
                  <a href="#" className="text-sm font-medium text-teal-600 hover:underline">Forgot password?</a>
                </div>
                <button 
                  type="submit" 
                  className="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500">
                  Don't have an account yet? <Link to="/register" className="font-medium text-teal-600 hover:underline">Sign up</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
