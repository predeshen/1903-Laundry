import React from 'react';
import { StyleSheet, View } from 'react-native';
import ARComponent from "../components/ARComponent";
import TopBarC from '../components/TopBar';
import BottomMenu from '../components/BottomMenu';


export default function ARScreen({ navigation ,countdown}) {
  const TopBar = ()  => {
    return (
      <TopBarC text={countdown}/>
    );
  };
  return (
    <View style={styles.container}>
      <TopBar />
      <ARComponent />
      <BottomMenu navigation={navigation} countdown={countdown}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
