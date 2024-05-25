import React, { useEffect, useState } from 'react';
import {wooCommerce,WooCommerce} from '../services/WooCommerceClient';
import * as SecureStore from 'expo-secure-store';
import { API_URL, CONSUMER_KEY, CONSUMER_SECRET } from '../apiConfig';


export const getCustomer = async () => {
  const username = await SecureStore.getItemAsync('username');
  try {
    const response = await WooCommerce.get('customers', {
        email:username,
        per_page: 1,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return [];
  }
};

export const updateCustomerMetaData = async (customerId, updatedMetaData) => {
  try {
    const userToken = await SecureStore.getItemAsync('username');
    const response = await WooCommerce.put(`customers/${customerId}`,{ meta_data: updatedMetaData },
      {
        headers: {
          Authorization: `Basic ${btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`)}`,
        },
      }
      
    );
    return response.data;
  } catch (error) {
    console.error('Error updating customer meta data:', error);
    return;
  }
};

// Add this function to retrieve the user token from SecureStore
export const getUserToken = async () => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken');
    return userToken;
    } catch (error) {
      console.error('Error fetching user token:', error);
      return [];
    }
};
