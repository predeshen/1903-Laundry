import React, { useEffect, useState } from 'react';
import { API_URL, CONSUMER_KEY, CONSUMER_SECRET } from '../apiConfig';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { encode } from 'base-64';


if (!global.btoa) {
  global.btoa = encode;
}
const wooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM

export const WooCommerce = new wooCommerceRestApi({
  url: 'https://hannahgracematernity.co.za',
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
  version: 'wc/v3',
  queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
});

export const wooCommerce = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Basic ${btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`)}`,
  },
});

export const currentDate = new Date();
export const year = currentDate.getFullYear();
export const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
export const day = String(currentDate.getDate()).padStart(2, '0');

