import React, { useEffect, useState } from 'react';
import { Animated, Easing, View, StyleSheet, Dimensions, Image } from 'react-native';
import { Colors, Fonts, CommonStyles } from '../theme'; // Import the theme styles

const LoadingBar2 = () => {
  const scrollX = new Animated.Value(0);
  const [currentImage, setCurrentImage] = useState(1);

  // Define the progress points for image changes
  const progressPoints = [0.4*100, 0.75*100]; // Switch to the second image at 40%, switch to the third at 75%

  // Get the screen width
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const animation = Animated.timing(scrollX, {
      toValue: 1,
      duration: 5000, // Total animation duration for three images (4 seconds per image)
      easing: Easing.linear,
      useNativeDriver: true,
    });

    animation.start();

    return () => {
      animation.stop();
      scrollX.removeAllListeners();
    };
  }, [currentImage]);

  const imageWidth = screenWidth * 0.9; // 90% of the screen width

  return (
    <View style={styles.Container}>
      <Animated.Image
        source={       
             require('../assets/pregnancy2.png')
        }
        style={{
          width: 100, // Set the width to 90% of the screen width
          height: 100, // Adjust the height as needed
          transform: [
            {
              translateX: scrollX.interpolate({
                inputRange: [0, 0.4, 0.75, 1],
                outputRange: [-imageWidth / 2, screenWidth * 0.4 / 2, screenWidth * 0.75 / 2, screenWidth * 0.9 / 2],
              }),
            },
          ],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({

});

export default LoadingBar2;
