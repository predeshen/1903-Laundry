import {wooCommerce,WooCommerce} from '../services/WooCommerceClient';
import {getUserToken} from '../services/UserService';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-root-toast';

export const getCartItems = async () => {
  const userToken = await getUserToken();

    const response = await axios.post(`https://1903laundry.co.za/wp-json/wc/store/cart/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response;
    if (!response.ok) {
      console.error('Request failed with status:', response.status);
      return;
    }
    else{
      return;
    }
};

export const addToCart = async (selecteditem) => {
  const userToken = await getUserToken();
  const queryParams = new URLSearchParams({
    id: selecteditem,
    quantity: 1,
  });

    const response = await axios.post(`https://1903laundry.co.za/wp-json/wc/store/cart/add-item?${queryParams}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.status;
    if (!result==='201') {
      console.error('error adding to cart');
      return 'error';
    }
    else{
        Toast.show('added to cart',error, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: '#DD3333',
          textColor: '#1C242A',
          opacity: 0.8,
          textStyle: {fontSize: 24,fontWeight: 'thin'},
          containerStyle: {width: '100%'},        
        });
      return 'added to cart';
    }
};

export const removeFromCart= async (key) => {

  const userToken = await getUserToken();
  const queryParams = new URLSearchParams({
    key
  });

  try {
    const response = await fetch(`https://1903laundry.co.za/wp-json/wc/store/cart/items/${key}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Request failed with status:', response);
      return;
    }
    else{
      Toast.show('removed from cart',error, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#DD3333',
        textColor: '#1C242A',
        opacity: 0.8,
        textStyle: {fontSize: 24,fontWeight: 'thin'},
        containerStyle: {width: '100%'},        
      });
      return;
    }

    const responseData = await response.json();
  } catch (error) {
    Toast.show('Error executing request:',error, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: '#DD3333',
      textColor: '#1C242A',
      opacity: 0.8,
      textStyle: {fontSize: 24,fontWeight: 'thin'},
      containerStyle: {width: '100%'},        
    });
    
    return;
  }

};

export const clearCart= async (key) => {

  const userToken = await getUserToken();
 
  try {
    const response = await fetch(`https://1903laundry.co.za/wp-json/wc/store/cart/items/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
     // console.error('Request failed with status:', response);
     Toast.show('Request failed with status:', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: '#DD3333',
      textColor: '#1C242A',
      opacity: 0.8,
      textStyle: {fontSize: 24,fontWeight: 'thin'},
      containerStyle: {width: '100%'},        
    });
      return;
    }
    else{
    // console.error('cleared cart',style);
    Toast.show('cleared cart', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.TOP,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
              backgroundColor: '#DD3333',
              textColor: '#1C242A',
              opacity: 0.8,
              textStyle: {fontSize: 24,fontWeight: 'thin'},
              containerStyle: {width: '100%'},        
            });
     return;
    }

    const responseData = await response.json();
  } catch (error) {
    console.error('Error executing request:', error);
    return;
  }

};

  export const fetchCartItems = async () => {
    try {
      const userToken = await SecureStore.getItemAsync('userToken');
      if (userToken) {
        const response = await fetch('https://www.1903laundrymaternity.co.za/wp-json/wc/store/cart/', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        const cartData = await response.json();
        return cartData.items; // Return the fetched cart items
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return;
    }
  };

  export const getCartItems2 = async () => {
   
      const userToken = await SecureStore.getItemAsync('userToken');
        const response = await fetch('https://1903laundry.co.za/wp-json/wc/store/cart/', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        return await response.json();
  };


