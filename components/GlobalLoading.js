import React, { useState, useEffect } from 'react';
import { View, Animated, Text, Easing, StyleSheet } from 'react-native';
import { Colors } from '../theme';
import PregnantLadyAnimation from './LoadingBar';
const GlobalLoading = () => {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const fadeAnim2 = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();
  }, []);

  return (
    <View style={styles.loadingContainer}>
    <PregnantLadyAnimation /> 
      <Animated.Text
        style={{
          opacity: fadeAnim,
          fontSize: 24,
          fontWeight: 'bold',
          fontFamily: 'tuesday-night',
          fontSize: 45,
          color: '#DD3333',
          textAlign: 'center',
        }}
      >
        1903 Laundry
        Loading...
      </Animated.Text>

      <View style={styles.FooterContainer}>
        <Animated.Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 18,
          }}
        >
          <Text style={styles.poweredBy}>Powered by </Text>
          <Text style={styles.hashub}> HASHUB</Text>
        </Animated.Text>
      </View>
    </View>

    
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background, // Adjust the background color and opacity
  },
  FooterContainer: {
    position: 'absolute', // Use "absolute" positioning
    bottom: 75,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center', // Align text to the left
  },
  poweredBy: {
    fontSize: 20,
    fontFamily: 'tuesday-night',
    color: 'aqua', // Powered by color
  },
  hashub: {
    fontSize: 27,
    color: '#44646b', // HASHUB color
  },
});

export default GlobalLoading;
