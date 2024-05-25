// services/woocommerceService.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { encode } from 'base-64';
import { API_URL, CONSUMER_KEY, CONSUMER_SECRET } from '../apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
const day = String(currentDate.getDate()).padStart(2, '0');
if (!global.btoa) {
  global.btoa = encode;
}

const wooCommerce = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Basic ${btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`)}`,
  },
});

const wooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM

const WooCommerce = new wooCommerceRestApi({
  url: 'https://1903laundry.co.za',
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
  version: 'wc/v3',
  queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
});

const calculateTaxedPrice = (price, taxRate) => {
  const taxAmount = (parseFloat(price) * parseFloat(taxRate)) / 100;
  const taxedPrice = parseFloat(price) + taxAmount;
  return taxedPrice.toFixed(2); // Round to 2 decimal places
};

// Add this function to retrieve the user token from SecureStore
const getUserToken = async () => {

  try {
    const userToken = await SecureStore.getItemAsync('userToken');
    return userToken;
    } catch (error) {
      console.error('Error fetching user token:', error);
      return [];
    }
};

export const getLatestProducts = async () => {
  try {
    const response = await WooCommerce.get('products', {
      params: {
        per_page: 25,
        orderby: 'date',
        order: 'desc',
      },
    });
    const taxRate = 15; // Set your tax rate in percentage

    const productsWithTax = response.data.map(product => {
      const taxedPrice = calculateTaxedPrice(product.price, taxRate);
      return {
        ...product,
        price: taxedPrice,
      };
    });
    return productsWithTax; 
   } catch (error) {
    console.error('Error fetching latest products:', error);
    return [];
  }
};

export const getLatestProductsv2old = async () => {
  const PAGE_SIZE = 25; // Number of products to fetch per page
  const INITIAL_LOAD_PAGES = 1; // Number of pages to load initially

  try {
    // Fetch the first page of products
    const response = await wooCommerce.get('products', {
      per_page: PAGE_SIZE,
      orderby: 'date',
      order: 'desc',
      page: 1, // Fetch the first page
    });

    // Check if there are multiple pages of products
    const totalpages = response.headers['x-wp-totalpages'];

    if (totalpages > INITIAL_LOAD_PAGES) {
      // Fetch the rest of the pages in the background
      const backgroundFetchPromises = [];

      for (let i = INITIAL_LOAD_PAGES + 1; i <= totalpages; i++) {
        const fetchPromise = getAllProducts(i, PAGE_SIZE);
        backgroundFetchPromises.push(fetchPromise);
      }

      // Wait for all background fetches to complete
      const backgroundResults = await Promise.all(backgroundFetchPromises);

      // Concatenate all products from background fetches
      const allProducts = response.data.concat(...backgroundResults);
      const productsWithTax = addTaxToProducts(allProducts);

      return productsWithTax;
    } else {
      // If only one page, add tax to the products and return
      const productsWithTax = addTaxToProducts(response.data);
      return productsWithTax;
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};





export const getAllProducts = async (page, pageSize) => {
  try {
    const response = await WooCommerce.get('products', {
      page: page,
      per_page: pageSize,
      orderby: 'date',
      order: 'desc',
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching products for page', page, error);
    return [];
  }
};


const addTaxToProducts = (products) => {
  const taxRate = 15; // Set your tax rate in percentage
  return products.map(product => {
    const taxedPrice = calculateTaxedPrice(product.price, taxRate);
    return {
      ...product,
      price: taxedPrice,
    };
  });
};


export const getProducts = async (page) => {
  try {
    const response = await WooCommerce.get('products', {
      params: {
        per_page: 50,
        page, // Use the page parameter here
        orderby: 'date',
        order: 'desc',
      },
    });
    const taxRate = 15;

    const productsWithTax = response.data.map((product) => {
      const taxedPrice = calculateTaxedPrice(product.price, taxRate);
      return {
        ...product,
        price: taxedPrice,
      };
    });

    await cacheData('allproducts', productsWithTax);

    return productsWithTax;
  } catch (response) {
    console.error('Error fetching products:', response);
    return;

  }
};

export const getParentCategoriesold = async () => {
  try {
    const response = await wooCommerce.get('products/categories', {
      params: {
        page:'1',
        per_page:'100',
        page:'1', 
        hide_empty:'true',
        context:'view',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    return [];
  }
};

export const getProductVariations = async (productId) => {
  const response="";
  try {
     response = await WooCommerce.get(`products/${productId}/variations`);
    return await response;
  } catch (error) {
    return [];
  }
};







export const getRandomProducts = async () => {
  try {
    const allProducts = await getLatestProducts();

    // Shuffle the products randomly
    const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());

    // Get the first 15 shuffled products
    const randomProducts = shuffledProducts.slice(0, 15);

    return randomProducts;
  } catch (error) {
    console.error('Error fetching random products:', error);
    return [];
  }
};

export const fetchSignInToken = async (username, password) => {

  const response = await axios.post('https://1903laundry.co.za/wp-json/jwt-auth/v1/token', {
    username: username,
    password: password,
  });
  if (response.data.token) {
    const token = response.data.token;
    await SecureStore.setItemAsync('userToken', token);

    return token;
  } else {
    throw new Error('Sign-in failed. Invalid credentials.');
  }

};

export const fetchSecondRequestToken = async (username, password) => {
  const requestBody = {
    username: username,
    password: password
  };

  const response = await fetch('https://1903laundry.co.za/wp-json/api/v1/mo-jwt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const responseData = await response.json();
  
  if (response.ok && responseData.jwt_token) {
    const autoLoginUserToken = responseData.jwt_token;
    await SecureStore.setItemAsync('autoLoginUserToken', autoLoginUserToken);

  } else {
    throw new Error('Failed to fetch second request token.');
  }
};

export const fetchRole = async (username, password) => {
try {
  const response = await WooCommerce.get('customers', {
    params: {
      email:username,
      per_page: 1,
    },
  });

  return response[0].role;
} catch (error) {
  console.error('Error fetching customer data:', error);
  return [];
}
};
  const fetchCartData = async () => {
    startLoading();
    try {
      const userToken = await SecureStore.getItemAsync('userToken');
      if (userToken) {
        const response = await fetch('https://1903laundry.co.za/wp-json/wc/store/cart/', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        const cartData = await response.json();

        if (Array.isArray(cartData.items)) {
          const updatedCart = cartData.items.map(item => ({
            ...item,
            prices: {
              ...item.prices,
              price: parseFloat(item.prices.price) / 100,
            },
          }));
          setCart(updatedCart);
          setCartTotal(calculateTotal(updatedCart));
        } else {
          console.error('Error fetching cart data'); 
          return;

        }
      }
    } catch (error) {
      console.error('Error fetching cart data');   
      return;

    }
  };

  export const getProductReviews = async (productId) => {
    try {
      const response = await WooCommerce.get(`products/reviews/${productId}`);
      
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error('Invalid product reviews data:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      return [];
    }
  };

  export const getProductReviewsv2 = (productId) => {
    wooCommerce.get(`products/reviews/${productId}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  };

export const submitProductReview = async (productId, reviewData) => {
  try {
    const userToken = await getUserToken();

    if (!userToken) {
      throw new Error('User token is missing.'); // Handle authentication error
    }

    const response = await WooCommerce.post(`products/${productId}/reviews`, reviewData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response.data && response.data.id) {
      return response.data;
    } else {
      console.error('Invalid product review data:', response.data);
      return;
    }
  } catch (error) {
    console.error('Error submitting product review:', error);
    return;
  }
};


export const loadMoreProductz = async (currentPage) => {
  try {

    // Fetch the next page of products
    const response = await wooCommerce.get('products', {
      per_page: 25,
      orderby: 'date',
      order: 'desc',
      page: currentPage, // Fetch the next page
    });


    // Check if there are more pages to load
    const totalpages = response.headers['x-wp-totalpages'];
    
    if (currentPage <= totalpages) {
      const productsWithTax = addTaxToProducts(response.data);

      return productsWithTax;
    } else {
      // If there are no more pages, return an empty array to signal the end
      return [];
    }
  } catch (error) {
    console.error('Error loading more products:', error);
    return [];
  }
};
