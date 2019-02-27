import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  withCredentials: false,
  headers: { token: localStorage.getItem('token') },
});
