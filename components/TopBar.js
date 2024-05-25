import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, SafeAreaView,Image,Dimensions } from 'react-native';
import { companyName, headerFontStyle } from '../fonts';
import { Colors, Fonts, CommonStyles } from '../theme'; // Import the theme styles
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons or any other icon library
import ScrollingText from './ScrollingText'; // Import your ScrollingText component
import {CustomAlert} from './CustomAlert';

const TopBar = ({text}) => {
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  useEffect(() => {

  },[text]);
  
  const handleBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="ios-arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.header}>
        </View>
        <Text style={[CommonStyles.headerText]}>1903 Laundry</Text>
        <ScrollingText text={text} />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background,
    height: 160,
  },
  container: {
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 90,
  },
  companyName: {
    ...headerFontStyle,
    fontSize: 24,
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
});

export default TopBar;
