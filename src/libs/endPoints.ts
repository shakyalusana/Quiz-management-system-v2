// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `/auth/register`,
  LOGIN: `/auth/login`,
} as const;

// All endpoints combined for easy access
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
} as const;

export default API_ENDPOINTS;
