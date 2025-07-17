import axios from 'axios';

// API Handler utility to reduce repetitive try-catch and token handling
class ApiHandler {
  static baseURL = 'http://localhost:3000/api';

  // Get token from localStorage
  static getToken() {
    return localStorage.getItem('token');
  }

  // Get headers with authorization
  static getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: token } : {};
  }

  // Handle common API errors
  static handleError(error, navigate) {
    console.error('API Error:', error);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('Session expired. Please login again.');
      localStorage.removeItem('token');
      if (navigate) navigate('/login');
      return;
    }
    
    // Return error message for custom handling
    return error.response?.data?.message || 'An error occurred. Please try again.';
  }

  // Generic API call wrapper
  static async apiCall(method, endpoint, data = null, navigate = null) {
    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: this.getAuthHeaders()
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = this.handleError(error, navigate);
      return { success: false, error: errorMessage };
    }
  }

  // Specific API methods
  static async get(endpoint, navigate = null) {
    return this.apiCall('GET', endpoint, null, navigate);
  }

  static async post(endpoint, data, navigate = null) {
    return this.apiCall('POST', endpoint, data, navigate);
  }

  static async patch(endpoint, data, navigate = null) {
    return this.apiCall('PATCH', endpoint, data, navigate);
  }

  static async delete(endpoint, navigate = null) {
    return this.apiCall('DELETE', endpoint, null, navigate);
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!this.getToken();
  }
}

export default ApiHandler;
