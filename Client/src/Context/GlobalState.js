import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

// Initial state
const initialState = {
  transactions: [],
  error: null,
  loading: true
}

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  async function getTransactions() {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/transaction');

      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }

  async function deleteTransaction(id) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/transaction/${id}`);
      
      // Optional: Check if the deletion was successful
      if (response.status === 200 || response.status === 204) {
        dispatch({
          type: 'DELETE_TRANSACTION',
          payload: id
        });
      } else {
        dispatch({
          type: 'TRANSACTION_ERROR',
          payload: `Unexpected response status: ${response.status}`
        });
      }
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || err.message || 'An unknown error occurred'
      });
    }
  }
  
  async function addTransaction(transaction) {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const res = await axios.post('http://localhost:5000/api/v1/Transaction', transaction, config);

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }

  return (<GlobalContext.Provider value={{
    transactions: state.transactions,
    error: state.error,
    loading: state.loading,
    getTransactions,
    deleteTransaction,
    addTransaction
  }}>
    {children}
  </GlobalContext.Provider>);
}