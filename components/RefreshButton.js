import React from 'react';
import { FAB } from 'react-native-paper';

const RefreshButton = () => {

  const handleRefresh = async () => {
    try {
      const [productData, categories] = await Promise.all([
        fetchProductData(), // Implement this function to fetch product data
        fetchCategories(),  // Implement this function to fetch categories
      ]);

      // Update cached data
      updateProductData(productData);
      updateCategories(categories);

      // Display a message or update the UI to indicate a successful refresh
    } catch (error) {
      setErrorText('Data refresh failed:', error);
      // Handle error and provide user feedback
    }
  };

  return (
    <FAB
      style={{
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
      }}
      icon="refresh" // You can change the icon as needed
      onPress={handleRefresh}
    />
  );
};

export default RefreshButton;
