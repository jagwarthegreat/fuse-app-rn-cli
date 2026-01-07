import axios from 'axios';
import Endpoints from './Endpoints';
import { getEnvVars } from './Environment';

const { apiUrl } = getEnvVars();

export const axiosInstance = axios.create({
  baseURL: apiUrl.app,
  // Remove withCredentials and withXSRFToken - they don't work in React Native
  // We'll use Bearer token authentication instead
  headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
  },
});

export const newApi = (apiPointTo, accessToken) => {
  return { url: apiPointTo, bearer: `Bearer ${accessToken}` }
};

export const ApiMethod = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const ApiEndpoints = () => {
  return Endpoints;
};