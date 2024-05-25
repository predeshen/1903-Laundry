import React, { useEffect, useState } from 'react';
import {wooCommerce,WooCommerce} from '../services/WooCommerceClient';



export const getProductVariationsv2 = async (productId) => {
    const response = await WooCommerce.get(`products/${productId}/variations`);
    return await response.data;
  };

  export const getParentCategories = async () => {
    try {
      let currentPage = 1;
  
        const response = await wooCommerce.get('products/categories', {
          params: {
            page: currentPage,
            per_page: 100, // Adjust per_page as needed
            hide_empty: true,
            context: 'view',
          },
        });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching parent categories:', error);
      return [];
    }
  };
  
  export const getLatestProductsv2 = async (page, pageSize) => {
    try {
      // Fetch products for the specified page and pageSize
      const response = await WooCommerce.get('products', {
        per_page: pageSize,
        orderby: 'date',
        order: 'desc',
        page: page,
        status: 'publish',
      });
      const productsWithTax = addTaxToProducts(response.data);
  
      return productsWithTax;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  export const getLatestProductsv3 = async (categories) => {
    try {
      const categorieIds = categories.join(',');
      // Fetch products for the specified page and pageSize
      const response = await WooCommerce.get('products', {
        orderby: 'date',
        order: 'desc',
        category: categorieIds??'',
        per_page: 100,
      });
  
      const productsWithTax = addTaxToProducts(response.data);
  
      return productsWithTax;
    } catch (error) {
      console.error('Error fetching products:', error);
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
  
  const calculateTaxedPrice = (price, taxRate) => {
    const taxAmount = (parseFloat(price) * parseFloat(taxRate)) / 100;
    const taxedPrice = parseFloat(price) + taxAmount;
    return taxedPrice.toFixed(2); // Round to 2 decimal places
  };

  export const getProductReviews = async (productId) => {
    const response = await wooCommerce.get('/products/reviews', {
      params: {
        page: 1,
        per_page: 5, // Adjust per_page as needed
        context: 'view',
      },
    });
    return response.data;
  };

  
  export const getProductImage = async (productId) => {
      const response = await wooCommerce.get(`products/${productId}/`);
      const productData = response.data;
      return productData.images[0].src;
  };