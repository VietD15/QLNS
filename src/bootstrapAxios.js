import axios from 'axios';

// Backend host: ONLY use ngrok URL.
const BE_FALLBACK = 'https://wham-untwist-scared.ngrok-free.dev';
const BE = import.meta.env.VITE_API_BASE || BE_FALLBACK;

console.log("Axios BaseURL (FORCED):", BE);

// Set default baseURL for relative axios requests
axios.defaults.baseURL = BE;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// Skip ngrok browser warning for API requests
axios.defaults.headers.common['ngrok-skip-browser-warning'] = '1';

// Interceptor to ensure NO requests go to 127.0.0.1
axios.interceptors.request.use((config) => {
  if (config.url && config.url.includes('127.0.0.1')) {
    console.warn("Blocking request to local address:", config.url);
    config.url = config.url.replace(/http:\/\/127\.0\.0\.1:8000/g, BE);
  }
  return config;
}, (error) => Promise.reject(error));

// Make axios available globally for scripts that use window.axios
window.axios = axios;

export default axios;
