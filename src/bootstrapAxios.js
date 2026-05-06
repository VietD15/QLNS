import axios from 'axios';

// Backend host: set VITE_API_BASE in production (Vercel) to the deployed BE URL
// Locally, do NOT set VITE_API_BASE so the app will continue to use localhost for testing.
const BE_FALLBACK = 'http://127.0.0.1:8000';
const BE = import.meta.env.VITE_API_BASE || BE_FALLBACK;

console.log("Axios BaseURL configured as:", BE);

// Set default baseURL for relative axios requests
axios.defaults.baseURL = BE;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// If VITE_API_BASE is set (deployed), rewrite any absolute localhost URLs used in the code
if (import.meta.env.VITE_API_BASE) {
  axios.interceptors.request.use((config) => {
    if (config && config.url && config.url.startsWith('http://127.0.0.1:8000')) {
      config.url = config.url.replace('http://127.0.0.1:8000', import.meta.env.VITE_API_BASE);
    }
    return config;
  }, (error) => Promise.reject(error));
}

// Make axios available globally for scripts that use window.axios
window.axios = axios;

export default axios;
