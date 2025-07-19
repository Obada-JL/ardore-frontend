"use client"
import { createContext, useContext, useReducer, useEffect } from 'react';

const OrderContext = createContext();

const initialState = {
  cart: [],
  orders: [],
  loading: false,
  error: null,
  cartTotal: 0,
  cartCount: 0,
  // Discount state
  appliedDiscount: null,
  discountLoading: false,
  discountError: null,
  subtotal: 0,
  discountAmount: 0,
  finalTotal: 0
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DISCOUNT_LOADING':
      return { ...state, discountLoading: action.payload };
    case 'SET_DISCOUNT_ERROR':
      return { ...state, discountError: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(
        item => item.product._id === action.payload.product._id && 
                item.size === action.payload.size &&
                item.quality === action.payload.quality
      );
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product._id === action.payload.product._id && 
            item.size === action.payload.size &&
            item.quality === action.payload.quality
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, action.payload]
        };
      }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload
      };
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders]
      };
    case 'APPLY_DISCOUNT':
      return {
        ...state,
        appliedDiscount: action.payload,
        discountError: null
      };
    case 'REMOVE_DISCOUNT':
      return {
        ...state,
        appliedDiscount: null,
        discountError: null,
        discountAmount: 0
      };
    case 'CALCULATE_TOTALS':
      const subtotal = state.cart.reduce((total, item) => {
        const price = item.product.discountedPrice || item.product.price;
        return total + (price * item.quantity);
      }, 0);
      
      const cartCount = state.cart.reduce((count, item) => count + item.quantity, 0);
      
      // Calculate discount amount
      let discountAmount = 0;
      if (state.appliedDiscount) {
        if (state.appliedDiscount.discountType === 'percentage') {
          discountAmount = (subtotal * state.appliedDiscount.discountValue) / 100;
          if (state.appliedDiscount.maxDiscountAmount && discountAmount > state.appliedDiscount.maxDiscountAmount) {
            discountAmount = state.appliedDiscount.maxDiscountAmount;
          }
        } else if (state.appliedDiscount.discountType === 'fixed') {
          discountAmount = Math.min(state.appliedDiscount.discountValue, subtotal);
        }
      }
      
      const finalTotal = Math.max(0, subtotal - discountAmount);
      
      return {
        ...state,
        subtotal,
        cartCount,
        cartTotal: finalTotal, // Keep backward compatibility
        discountAmount,
        finalTotal
      };
    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTALS' });
  }, [state.cart, state.appliedDiscount]);

  useEffect(() => {
    // Load cart from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('ardore_cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          cart.forEach(item => {
            dispatch({ type: 'ADD_TO_CART', payload: item });
          });
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever cart changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('ardore_cart', JSON.stringify(state.cart));
    }
  }, [state.cart]);

  const addToCart = (product, quantity = 1, size, quality) => {
    const cartItem = {
      id: `${product._id}-${size}-${quality}`,
      product,
      quantity,
      size,
      quality
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateCartItem = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { id: itemId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    dispatch({ type: 'REMOVE_DISCOUNT' });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const addOrder = (order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
  };

  const setOrders = (orders) => {
    dispatch({ type: 'SET_ORDERS', payload: orders });
  };

  // Discount functions
  const validateDiscount = async (discountCode) => {
    dispatch({ type: 'SET_DISCOUNT_LOADING', payload: true });
    dispatch({ type: 'SET_DISCOUNT_ERROR', payload: null });

    try {
      const response = await fetch('https://api.ardoreperfume.com/api/discounts/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: discountCode,
          orderAmount: state.subtotal,
          productIds: state.cart.map(item => item.product._id)
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        dispatch({ type: 'APPLY_DISCOUNT', payload: data.discount });
        return { success: true, discount: data.discount };
      } else {
        dispatch({ type: 'SET_DISCOUNT_ERROR', payload: data.message });
        return { success: false, error: data.message };
      }
    } catch (error) {
      const errorMessage = 'Failed to validate discount code';
      dispatch({ type: 'SET_DISCOUNT_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_DISCOUNT_LOADING', payload: false });
    }
  };

  const removeDiscount = () => {
    dispatch({ type: 'REMOVE_DISCOUNT' });
  };

  return (
    <OrderContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        setLoading,
        setError,
        addOrder,
        setOrders,
        validateDiscount,
        removeDiscount
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}; 