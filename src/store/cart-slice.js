import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
  },

  reducers: {
    replaceCart(state, action) {
      state.totalQuantity = action.payload.totalQuantity;
      state.items = action.payload.items;
    },

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

export const cartActions = cartSlice.actions;

export default cartSlice;
