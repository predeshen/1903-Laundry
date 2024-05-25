import React, { useEffect }  from 'react';
import { View, StyleSheet,Text } from 'react-native';
import TextTicker from 'react-native-text-ticker';
import { useRoute } from '@react-navigation/native';
import { CommonStyles, Fonts, Colors } from '../theme';

// Your other imports

const ScrollingText = ( {text }) => {

  useEffect(() => {

  },[text]);
    return (
      <View style={styles.container}>
        <TextTicker
          style={styles.scrollText}
          duration={12000} // Duration of the animation in milliseconds
          loop={true} // Set to true for continuous scrolling
          bounce={true} // Set to true for bouncing effect
        >
         <Text style={styles.Countdown}>LAUNDRY DONE RIGHT !!! WE WILL TAKE CARE OF YOUR LAUNDRY LIKE OUR OWN </Text>
        </TextTicker>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      // Add any styling for the container view
      borderBlockColor:"#84DCBC",
      borderWidth:0.24,
    },
    scrollText: {
      fontSize: 16,
      color: Colors.body,
      fontWeight:'bold',      // Add any additional styling for the scrolling text
    },
  });
  
  export default ScrollingText;
  