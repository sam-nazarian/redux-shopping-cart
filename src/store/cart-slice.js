import { createSlice } from '@reduxjs/toolkit';

import { uiActions } from './ui-slice';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
  },

  reducers: {
    /**
     * @param {Object} action  {id, title, price} action is what the user sends
     * {id, name, price, quantity, totalPrice} is what we send
     */
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity++;
      if (!existingItem) {
        // push mutates an existing arr
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price, //since quantity is 1, totalPrice is just the price
          name: newItem.title,
        });
      } else {
        existingItem.quantity++; //mutates state.items arr, since we're modifying an elm in the existingItem
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },

    // Automatically created action creator
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      state.totalQuantity--;

      if (existingItem.quantity === 1) {
        //select items that don't have the id, should be removed (select everything that doesn't have id)
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
  },
});

// Action Creator Thunk which contains side effects
export const sendCartData = (cart) => {
  // return {type: '', payload: ...} //what default redux toolkit action creators look like (funcs that return an action object)
  // Redux will give dispatch argument, & execute the function automatically
  return async (dispatch) => {
    // Loading
    dispatch(uiActions.showNotification({ status: 'pending', title: 'Sending...', message: 'Sending cart data!' }));

    const sendRequest = async () => {
      // PUT stores data but unlike post it will override existing data, & won't be added to a list of data
      const response = await fetch('https://advanced-redux-644d2-default-rtdb.firebaseio.com/cart.json', { method: 'PUT', body: JSON.stringify(cart) });

      if (!response.ok) {
        throw new Error('Sending cart data failed.');
      }
    };

    try {
      await sendRequest();

      // Success
      dispatch(uiActions.showNotification({ status: 'success', title: 'Success!', message: 'Sent cart data successfully!' }));
    } catch (error) {
      // Error
      dispatch(uiActions.showNotification({ status: 'error', title: 'Error!', message: 'Sending cart data failed!' }));
    }
  };
};

export const cartActions = cartSlice.actions;

export default cartSlice;
