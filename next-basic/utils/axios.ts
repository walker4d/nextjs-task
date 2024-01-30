// axios.ts

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your API base URL
  timeout: 5000, // Set your preferred timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally, you can define custom types for your Axios instance
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  // Add custom configuration options if needed
}

// You can extend the AxiosInstance type with your custom type
interface CustomAxiosInstance extends AxiosInstance {
  (config: CustomAxiosRequestConfig): Promise<any>;
}

// Export the custom Axios instance
const $axios: CustomAxiosInstance = axiosInstance as CustomAxiosInstance;
export default $axios;
