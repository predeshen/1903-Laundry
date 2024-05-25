import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import GlobalLoading from './GlobalLoading'; // Import your GlobalLoading component

const LoadingOverlay = () => {
 // console.log('overlay');
  return (
    <View style={styles.overlay}>
      <GlobalLoading size="large" color="black" />     
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingOverlay;
