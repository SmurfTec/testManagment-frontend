import { LOCALSTORAGE_TOKEN_KEY } from 'src/Contexts/AuthContext';
import { toast } from 'react-toastify';

// * Development URLs
const API_BASE_URL = `http://localhost:7001/api`;
const API_BASE_ORIGIN = `http://localhost:7001`;

const handleCatch = (err) => {
  // console.log('**********');
  // console.log(`err`, err);
  let errMsg = 'Something Went Wrong';
  if (err.message) errMsg = err.message;
  toast.error(errMsg);
};

const makeReq = (
  endpoint, // e.g '/users
  { body, ...customConfig } = {},
  method = 'GET'
) => {
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: method,
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }
  return fetch(`${API_BASE_URL}${endpoint}`, config).then(
    async (res) => {
      const data = await res.json();
      // console.log(`data`, data);
      if (res.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    }
  );
};

export { API_BASE_URL, makeReq, handleCatch, API_BASE_ORIGIN };
