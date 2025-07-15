import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Change as needed
  withCredentials: true, // if using cookies
});

export default api;