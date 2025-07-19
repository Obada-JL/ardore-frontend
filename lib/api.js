// API Configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.ardoreperfume.com';

export const API_ENDPOINTS = {
  // Base URL
  BASE_URL,
  
  // Auth endpoints
  LOGIN: `${BASE_URL}/api/users/login`,
  REGISTER: `${BASE_URL}/api/users/register`,
  CURRENT_USER: `${BASE_URL}/api/users/me`,

  // User endpoints
  GET_USERS: `${BASE_URL}/api/users`,
  GET_USER: (id) => `${BASE_URL}/api/users/${id}`,
  ADD_USER: `${BASE_URL}/api/users`,
  UPDATE_USER: (id) => `${BASE_URL}/api/users/${id}`,
  DELETE_USER: (id) => `${BASE_URL}/api/users/${id}`,

  // Message endpoints
  GET_MESSAGES: `${BASE_URL}/api/messages`,
  GET_MESSAGE: (id) => `${BASE_URL}/api/messages/${id}`,
  CREATE_MESSAGE: `${BASE_URL}/api/messages`,
  UPDATE_MESSAGE: (id) => `${BASE_URL}/api/messages/${id}`,
  DELETE_MESSAGE: (id) => `${BASE_URL}/api/messages/${id}`,

  // Perfume endpoints
  GET_PERFUMES: `${BASE_URL}/api/perfumes`,
  GET_PERFUME: (id) => `${BASE_URL}/api/perfumes/${id}`,
  GET_PERFUME_BY_URL: (urlName) => `${BASE_URL}/api/perfumes/url/${urlName}`,
  ADD_PERFUME: `${BASE_URL}/api/perfumes`,
  UPDATE_PERFUME: (id) => `${BASE_URL}/api/perfumes/${id}`,
  DELETE_PERFUME: (id) => `${BASE_URL}/api/perfumes/${id}`,

  // About endpoints
  GET_ABOUT: `${BASE_URL}/api/about`,
  ADD_ABOUT: `${BASE_URL}/api/about`,
  UPDATE_ABOUT: `${BASE_URL}/api/about`,
  DELETE_ABOUT: `${BASE_URL}/api/about`,

  // Category endpoints
  GET_CATEGORIES: `${BASE_URL}/api/categories`,
  GET_CATEGORY: (slug) => `${BASE_URL}/api/categories/${slug}`,

  // Discount endpoints
  GET_DISCOUNTS: `${BASE_URL}/api/discounts`,
  GET_ACTIVE_DISCOUNTS: `${BASE_URL}/api/discounts/active`,
  VALIDATE_DISCOUNT: `${BASE_URL}/api/discounts/validate`,
  APPLY_DISCOUNT: `${BASE_URL}/api/discounts/apply`,

  // Health check
  HEALTH: `${BASE_URL}/health`,
};

// Get auth token from localStorage
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Set auth token in localStorage
export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Remove auth token from localStorage
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// API utility functions
export const apiRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };
  console.log(defaultOptions.headers)

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth-specific API functions
export const authAPI = {
  login: async (credentials) => {
    return apiRequest(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return apiRequest(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getCurrentUser: async () => {
    return apiRequest(API_ENDPOINTS.CURRENT_USER);
  },

  logout: () => {
    removeAuthToken();
  }
};

// About-specific API functions
export const aboutAPI = {
  getAbout: async () => {
    return apiRequest(API_ENDPOINTS.GET_ABOUT);
  },

  createOrUpdateAbout: async (aboutData) => {
    return apiRequest(API_ENDPOINTS.ADD_ABOUT, {
      method: 'POST',
      body: JSON.stringify(aboutData),
    });
  },

  deleteAbout: async () => {
    return apiRequest(API_ENDPOINTS.DELETE_ABOUT, {
      method: 'DELETE',
    });
  }
};

// Message-specific API functions
export const messageAPI = {
  createMessage: async (messageData) => {
    return apiRequest(API_ENDPOINTS.CREATE_MESSAGE, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  getMessages: async () => {
    return apiRequest(API_ENDPOINTS.GET_MESSAGES);
  },

  getMessage: async (id) => {
    return apiRequest(API_ENDPOINTS.GET_MESSAGE(id));
  },

  updateMessage: async (id, messageData) => {
    return apiRequest(API_ENDPOINTS.UPDATE_MESSAGE(id), {
      method: 'PATCH',
      body: JSON.stringify(messageData),
    });
  },

  deleteMessage: async (id) => {
    return apiRequest(API_ENDPOINTS.DELETE_MESSAGE(id), {
      method: 'DELETE',
    });
  }
};

// Category-specific API functions
export const categoryAPI = {
  getCategories: async () => {
    return apiRequest(API_ENDPOINTS.GET_CATEGORIES);
  },

  getCategory: async (slug) => {
    return apiRequest(API_ENDPOINTS.GET_CATEGORY(slug));
  }
};

// Perfume-specific API functions
export const perfumeAPI = {
  getPerfumes: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_ENDPOINTS.GET_PERFUMES}?${queryString}` : API_ENDPOINTS.GET_PERFUMES;
    return apiRequest(url);
  },

  getFavoritePerfumes: async () => {
    return apiRequest(`${API_ENDPOINTS.GET_PERFUMES}?favorite=true`);
  },

  getPerfume: async (id) => {
    return apiRequest(API_ENDPOINTS.GET_PERFUME(id));
  },

  getPerfumeByUrl: async (urlName) => {
    return apiRequest(API_ENDPOINTS.GET_PERFUME_BY_URL(urlName));
  }
};

// User statistics API functions
export const userStatsAPI = {
  getUserOrders: async () => {
    return apiRequest(`${API_ENDPOINTS.BASE_URL}/api/orders`);
  },

  getFavoritesCount: async () => {
    const response = await apiRequest(`${API_ENDPOINTS.BASE_URL}/api/favorites/count`);
    return response.count;
  }
};

// Favorites API functions
export const favoritesAPI = {
  getUserFavorites: async () => {
    return apiRequest(`${API_ENDPOINTS.BASE_URL}/api/favorites`);
  },

  addToFavorites: async (perfumeId) => {
    return apiRequest(`${API_ENDPOINTS.BASE_URL}/api/favorites`, {
      method: 'POST',
      body: JSON.stringify({ perfumeId })
    });
  },

  removeFromFavorites: async (perfumeId) => {
    return apiRequest(`${API_ENDPOINTS.BASE_URL}/api/favorites/${perfumeId}`, {
      method: 'DELETE'
    });
  },

  toggleFavorite: async (perfumeId) => {
    return apiRequest(`${API_ENDPOINTS.BASE_URL}/api/favorites/toggle`, {
      method: 'PUT',
      body: JSON.stringify({ perfumeId })
    });
  },

  getFavoritesCount: async () => {
    const response = await apiRequest(`${API_ENDPOINTS.BASE_URL}/api/favorites/count`);
    return response.count;
  },

  isFavorite: async (perfumeId) => {
    const response = await apiRequest(`${API_ENDPOINTS.BASE_URL}/api/favorites/check/${perfumeId}`);
    return response.isFavorite;
  }
};

export default API_ENDPOINTS; 