// utils/api.js - Axios API Client
// Centralized API calls with Clerk auth token

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://prepgenius-ai-eeee.onrender.com'

// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60 second timeout (AI calls can be slow)
})

// Function to create an API instance with the Clerk auth token
export const createAuthApi = (getToken) => {
  const authApi = axios.create({
    baseURL: API_URL,
    timeout: 60000,
  })
  
  // Add token to every request automatically
  authApi.interceptors.request.use(async (config) => {
    try {
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (err) {
      console.error('Could not get auth token:', err)
    }
    return config
  })
  
  // Handle errors globally
  authApi.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.error || error.message || 'An error occurred'
      return Promise.reject(new Error(message))
    }
  )
  
  return authApi
}

export default api
