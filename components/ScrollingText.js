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
         <Text style={styles.Countdown}>Hey Mom-to-be, we're counting down the days with you <Text style={styles.CountdownNo}>{text}</Text> !!! days till the big day </Text>
        </TextTicker>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    Countdown: {
      // Add any styling for the container view
      fontSize: 35,
      color: 'grey',
      textAlign: 'center',
      fontWeight:'thin',
    },
    CountdownNo: {
      // Add any styling for the container view
      fontFamily: Fonts.header,
      fontSize: 45,
      color: 'red',
      textAlign: 'center',
      paddingTop: 15,
    },
    container: {
      // Add any styling for the container view
      borderBlockColor:"red",
      borderWidth:0.24,
    },
    scrollText: {
      fontSize: 22,
      color: 'black',
      fontWeight:'bold',      // Add any additional styling for the scrolling text
    },
  });
  
  export default ScrollingText;
  