import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';

function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    // PUT stores data but unlike post it will override existing data, & won't be added to a list of data
    fetch('https://advanced-redux-644d2-default-rtdb.firebaseio.com/cart.json', { method: 'PUT', body: JSON.stringify(cart) });
  }, [cart]);

  return (
    <Layout>
      {showCart && <Cart />}
      <Products />
    </Layout>
  );
}

export default App;
