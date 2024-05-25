import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import TopBar from '../components/TopBar';
import withLoadingOverlay from '../components/withLoadingOverlay';
import * as SecureStore from 'expo-secure-store';
import { fetchSignInToken, fetchSecondRequestToken } from '../Logic/SignInLogic'; // Import the logic functions
import { Colors } from '../theme';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = ({ route, startLoading, stopLoading }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef(null);
  const userToken = SecureStore.getItemAsync('userToken');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const navigation = useNavigation();

  const injectedJavaScript = `
  (function() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode('header.jupiterx-header.jupiterx-header-custom.jupiterx-header-sticky-custom {
      display: none; !important;
  }'));
    style.appendChild(document.createTextNode('section.elementor-section.elementor-top-section.elementor-element.elementor-element-7491fd7.elementor-section-height-min-height.elementor-section-full_width.elementor-section-stretched.elementor-section-height-default.elementor-section-items-middle {
      display: none; !important;
  }'));
    style.appendChild(document.createTextNode('footer.jupiterx-footer {display: none ;!important;}'));
    style.appendChild(document.createTextNode('.woocommerce-password-strength.bad { font-weight: bolder; color: red !important;}')); 
    style.appendChild(document.createTextNode('small.woocommerce-password-hint    { color: red; !important; }')); 
    style.appendChild(document.createTextNode('body .jupiterx-site {color: #E4C4BC; !important;}'));
    style.appendChild(document.createTextNode('.jupiterx-main{ background-color: #1C242A; !important; }'));
    document.head.appendChild(style);
    
    // Add a click event listener to the "Register" button
    const registerButton = document.querySelector('.woocommerce-Button[name="register"]');
    if (registerButton) {
      registerButton.addEventListener('click', function() {
        const emailField = document.getElementById('reg_email');
        const passwordField = document.getElementById('reg_password');
        if (emailField && passwordField) {
          const username = emailField.value;
          const password = passwordField.value;

          // Send the username and password back to React Native
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'registerCredentials',
            username: username,
            password: password
          }));
        }
      });
    }
  })();
  ${userLoginCheckScript}
`;

const userLoginCheckScript = `
  (function() {
    // Check if user is logged in
    if (document.body.classList.contains('logged-in')) {
      // Extract username and password fields from the form
      const emailField = document.getElementById('reg_email');
      const passwordField = document.getElementById('reg_password');
      
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'loggedInCredentials',
        }));     
    }
  })();
`;

const loadingStartScript = `
  (function() {
    // Send a message to notify the app that loading has started
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'loadingStart'
    }));
  })();
`;
const handleWebViewLoadEnd = (event) => {
  //startLoading();
  webViewRef.current.injectJavaScript(injectedJavaScript);
 // webViewRef.current.injectJavaScript(userLoginCheckScript);
  stopLoading();
};

  // const handleWebViewMessage =  (event)  => {
  //   try {
  //     const message = JSON.parse(event.nativeEvent.data);
  //  if (message.type === 'loadingStart') {
  //     // You can call your startLoading() method here
  //     startLoading();
  //   } 
  //   else if (message.type === 'registerCredentials') {
  //     setUsername(message.username); // Use setUsername to update the state
  //     setPassword(message.password); 
  //     setRegistrationMessage('Registering...'); // Display a registration message
  //   }
  //  else if (message.type === 'loggedInCredentials') {
  //       const token =  fetchSignInToken(username, password);
  //        fetchSecondRequestToken(username, password);
  //        SecureStore.setItemAsync('username', username);
  //       stopLoading();
  //       setRegistrationMessage('Registration successful! Redirecting...'); // Display a success message
  //       navigation.navigate('InstagramStyleScreen', { userToken: token });
  //       // Handle the credentials as needed
  //     } 
  //   } catch (error) {
  //     navigation.navigate('SignIn');
  //     setErrorText('Error parsing WebView message:', error);
  //   }
  // };

  useEffect(() => {
    startLoading();
    stopLoading();
    setIsLoading(false);
  }, []);
  
  return (
    <View style={styles.container}>
      <TopBar />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dd3333" />
          <Text>{registrationMessage || 'Loading...'}</Text>
        </View>
      )}
      <WebView
        incognito={true}
        ref={webViewRef}
        source={{ uri: 'https://1903laundry.co.za/my-account' }}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled={true}
        javaScriptEnabledAndroid={true}
        sharedCookiesEnabled={false}
        onLoadStart={() => {
          setIsLoading(true);
          startLoading();
        }}
        onLoadEnd={() => {
          setIsLoading(false);
          stopLoading();
        }}
        //onLoadEnd={handleWebViewLoadEnd}
        // onMessage={handleWebViewMessage}
      />
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    height:'100%',
    width:'100%',
  },
  topBar: {
    height: 50, // Adjust height as needed
    backgroundColor: 'lightgray', // Adjust background color as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomMenu: {
    height: 50, // Adjust height as needed
    backgroundColor: 'lightgray', // Adjust background color as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default withLoadingOverlay(SignUpScreen); // Use the withLoading HOC

