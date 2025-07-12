import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.priceCents * item.quantity), 0);
        const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
          ...state,
          items: updatedItems,
          total: newTotal,
          itemCount: newItemCount,
        };
      } else {
        const newItems = [...state.items, action.payload];
        const newTotal = newItems.reduce((sum, item) => sum + (item.priceCents * item.quantity), 0);
        const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
          ...state,
          items: newItems,
          total: newTotal,
          itemCount: newItemCount,
        };
      }

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      const newTotal = filteredItems.reduce((sum, item) => sum + (item.priceCents * item.quantity), 0);
      const newItemCount = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: filteredItems,
        total: newTotal,
        itemCount: newItemCount,
      };

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      
      const updatedTotal = updatedItems.reduce((sum, item) => sum + (item.priceCents * item.quantity), 0);
      const updatedItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: updatedItems,
        total: updatedTotal,
        itemCount: updatedItemCount,
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };

    case 'LOAD_CART':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success(`${item.title} added to cart`);
  };

  const removeItem = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const getItemQuantity = (itemId) => {
    const item = state.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const isInCart = (itemId) => {
    return state.items.some(item => item.id === itemId);
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};