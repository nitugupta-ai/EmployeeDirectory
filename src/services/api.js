import axios from "axios";

// Create an Axios instance for reusable configuration
const API = axios.create({
  baseURL: "http://localhost:5000", // Base URL for your API
});

// Export the API instance for direct usage in the component
export default API;
