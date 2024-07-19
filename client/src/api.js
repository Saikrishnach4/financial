import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Update with your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('token'),
  },
});


export default api;
