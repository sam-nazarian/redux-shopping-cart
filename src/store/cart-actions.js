import { uiActions } from './ui-slice';
import { cartActions } from './cart-slice';

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch('https://advanced-redux-644d2-default-rtdb.firebaseio.com/cart.json');

      if (!response.ok) {
        throw new Error('Could not fetch cart data!');
      }

      const data = await response.json();

      return data;
    };

    try {
      const cartData = await fetchData();
      dispatch(cartActions.replaceCart(cartData));
    } catch (error) {
      // Error
      dispatch(uiActions.showNotification({ status: 'error', title: 'Error!', message: 'Fetching cart data failed!' }));
    }
  };
};

// 1) action object (what we use in regular redux)
// 2) action creator that returns an action object (what we use with redux toolkit)
// 3) action creator that returns another function. (An action creator thunk) Dispatch is passed to this function.
// any side effect code CAN go inside this function,hence keeps your components lean.

// Action Creator Thunk (will be called inside of the dispatch()) which contains side effects
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
