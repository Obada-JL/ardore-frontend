"use client"
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { favoritesAPI } from '../../lib/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

const initialState = {
  favorites: [],
  favoritesCount: 0,
  loading: false,
  error: null
};

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_FAVORITES':
      const validFavorites = action.payload.filter(fav => fav && fav._id);
      return { 
        ...state, 
        favorites: validFavorites, 
        favoritesCount: validFavorites.length,
        loading: false,
        error: null
      };
    case 'ADD_FAVORITE':
      const newFavorites = [...state.favorites, action.payload];
      return { 
        ...state, 
        favorites: newFavorites, 
        favoritesCount: newFavorites.length 
      };
    case 'REMOVE_FAVORITE':
      const filteredFavorites = state.favorites.filter(fav => fav && fav._id !== action.payload);
      return { 
        ...state, 
        favorites: filteredFavorites, 
        favoritesCount: filteredFavorites.length 
      };
    case 'CLEAR_FAVORITES':
      return { 
        ...state, 
        favorites: [], 
        favoritesCount: 0 
      };
    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Fetch favorites when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFavorites();
    } else {
      dispatch({ type: 'CLEAR_FAVORITES' });
    }
  }, [isAuthenticated, user]);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const favorites = await favoritesAPI.getUserFavorites();
      dispatch({ type: 'SET_FAVORITES', payload: favorites });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [isAuthenticated]);

  const addToFavorites = useCallback(async (perfume) => {
    if (!isAuthenticated) {
      dispatch({ type: 'SET_ERROR', payload: 'Please login to add favorites' });
      return false;
    }

    try {
      await favoritesAPI.addToFavorites(perfume._id);
      dispatch({ type: 'ADD_FAVORITE', payload: perfume });
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return false;
    }
  }, [isAuthenticated]);

  const removeFromFavorites = useCallback(async (perfumeId) => {
    if (!isAuthenticated) return false;

    try {
      await favoritesAPI.removeFromFavorites(perfumeId);
      dispatch({ type: 'REMOVE_FAVORITE', payload: perfumeId });
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return false;
    }
  }, [isAuthenticated]);

  const toggleFavorite = useCallback(async (perfume) => {
    if (!isAuthenticated) {
      dispatch({ type: 'SET_ERROR', payload: 'Please login to manage favorites' });
      return false;
    }

    try {
      const response = await favoritesAPI.toggleFavorite(perfume._id);
      
      if (response.isFavorite) {
        dispatch({ type: 'ADD_FAVORITE', payload: perfume });
      } else {
        dispatch({ type: 'REMOVE_FAVORITE', payload: perfume._id });
      }
      
      return response.isFavorite;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return false;
    }
  }, [isAuthenticated]);

  const isFavorite = useCallback((perfumeId) => {
    return state.favorites.some(fav => fav && fav._id === perfumeId);
  }, [state.favorites]);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const value = {
    favorites: state.favorites,
    favoritesCount: state.favoritesCount,
    loading: state.loading,
    error: state.error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    fetchFavorites,
    clearError
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 