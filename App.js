import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import React, { useEffect, useState,useRef  } from 'react';
import { NavigationContainer} from '@react-navigation/native';
import InstagramStyleScreen from './screens/InstagramStyleScreen';
import SignInScreen from './screens/SignInScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrdersScreen from './screens/OrdersScreen';
import ScrollingText from './components/ScrollingText';
import AccountsScreen from './screens/AccountsScreen';
import SignUpScreen from './screens/SignUpScreen';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import * as SecureStore from 'expo-secure-store';
import ARScreen from './screens/ARScreen';
import { RootSiblingParent } from 'react-native-root-siblings';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [showAlert, setShowAlert] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');



  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
  
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
  
      await SecureStore.setItemAsync('expoPushToken', `${token.data}`);
    //  setAlertMessage(`existing meta token secure store ${token.data}`);
    // setShowAlert(true);
    //  console.log(token.data);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

  const handleCloseAlert = ()=> {
    setShowAlert(false);
  };

  async function loadFonts() {
    await Font.loadAsync({
      'tuesday-night': require('./assets/TuesdayNight.otf'),
      // Load other fonts here
    });
    setFontsLoaded(true);
  }

  useEffect(() => {
    
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      //console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  
  useEffect(() => {
    loadFonts();
  }, []);

 
  const Stack = createNativeStackNavigator();

  if (!fontsLoaded) {
    return null; // Return null while fonts are loading
  }

  return (
    <RootSiblingParent>
    <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn"> 
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="InstagramStyleScreen" component={InstagramStyleScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CartScreen" component={CartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CheckoutScreen"component={CheckoutScreen}options={{title: 'Checkout',headerShown: false }}/>
        <Stack.Screen name="OrdersScreen" component={OrdersScreen} options={{ headerShown: false }} />       
        <Stack.Screen name="AccountsScreen" component={AccountsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ScrollingText" component={ScrollingText}  /> 
        <Stack.Screen name="ARScreen" component={ARScreen}  options={{ headerShown: false }} />
      </Stack.Navigator>
 </NavigationContainer>
 </RootSiblingParent>

);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
