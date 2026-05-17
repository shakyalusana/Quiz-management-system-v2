// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `/auth/register`,
  LOGIN: `/auth/login`,
  LOGOUT: `/auth/logout`,
} as const;

/* ----------------------------------
   QUESTION ENDPOINTS
-----------------------------------*/
export const QUESTION_ENDPOINTS = {
  GET_ALL: `/questions`,
  CREATE: `/questions`,
  UPDATE: (id: string) => `/questions/${id}`,
  DELETE: (id: string) => `/questions/${id}`,
} as const;

/* ----------------------------------
   CATEGORY ENDPOINTS
-----------------------------------*/
export const CATEGORY_ENDPOINTS = {
  GET_ALL: `/categories`,
  CREATE: `/categories`,
  DELETE: (id: string) => `/categories/${id}`,
} as const;

/* ----------------------------------
   QUIZ ENDPOINTS
-----------------------------------*/
export const QUIZ_ENDPOINTS = {
  GET_QUESTIONS: `/quiz/questions`,
  SUBMIT_QUIZ: `/quiz/submit`,
} as const;

// recommendation endpoint
export const RECOMMENDATION_ENDPOINTS = {
  GET_RECOMMENDATIONS: `/recommendations`,
} as const;

/* ----------------------------------
   ALL ENDPOINTS
-----------------------------------*/
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  QUESTION: QUESTION_ENDPOINTS,
  CATEGORY: CATEGORY_ENDPOINTS,
  QUIZ: QUIZ_ENDPOINTS,
  RECOMMENDATION: RECOMMENDATION_ENDPOINTS,
} as const;

export default API_ENDPOINTS;
