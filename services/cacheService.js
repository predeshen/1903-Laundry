import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const cacheData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const getCachedData = async (key) => {
  try {
    const cachedData = await AsyncStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};
