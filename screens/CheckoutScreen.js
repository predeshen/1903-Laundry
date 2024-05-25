import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import TopBar from '../components/TopBar';
import BottomMenu from '../components/BottomMenu';
import { useNavigation } from '@react-navigation/native';
import withLoadingOverlay from '../components/withLoadingOverlay';
import { Colors } from '../theme';
import * as SecureStore from 'expo-secure-store';

const CheckoutScreen = ({ route, startLoading, stopLoading }) => {
  const navigation = useNavigation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef(null);
  const [shouldShowWebView, setShouldShowWebView] = useState(true);
  const [Url, setUrl] = useState('');

  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (errorText) {
      Alert.alert('Error', errorText);
      setErrorText('');
    }
  }, [errorText]);
  
  const injectedJavaScript = `
    (function() {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode('.mkdf-mobile-header { display: none !important; }'));
      style.appendChild(document.createTextNode('.mkdf-page-footer { display: none !important; }'));
      style.appendChild(document.createTextNode('.mkdf-content    { background-color: #1C242A; }'));
      style.appendChild(document.createTextNode('p.order-again {display: none;}'));
      style.appendChild(document.createTextNode('.mkdf-container-inner.clearfix {padding: 0px !important;}'));
      style.appendChild(document.createTextNode('.mkdf-title-holder.mkdf-standard-type.mkdf-title-va-header-bottom {display: none;}'));
      style.appendChild(document.createTextNode('div#ht-ctc-chat {display: none;}'));
      document.head.appendChild(style);
    })();
  `;

  const onPageLoad = () => {
      webViewRef.current.injectJavaScript(injectedJavaScript);
  };

  const onShouldStartLoadWithRequest = (event) => {
    // Check if the requested URL contains 'https://1903laundrymaternity'
    if (event.url ==='https://1903laundry.co.za/'|| event.url ==='https://1903laundry.co.za/shop') {
      // Navigate to OrdersScreen
      navigation.navigate('OrdersScreen');
      // Prevent loading the URL in the WebView
      return false;
    }
    return true; // Allow loading all other URLs
  };

  useEffect(() => {
    const { checkoutUrl } = route.params;
    setUrl(checkoutUrl);
  }, [route]);

  return (
    <View style={styles.container}>
      <TopBar />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dd3333" />
          <Text>Loading...</Text>
        </View>
      )}
      <WebView
        originWhitelist={['*']}
        ref={webViewRef}
        injectedJavaScript={injectedJavaScript}
        source={{ uri: Url }}
        javaScriptEnabled={true}
        javaScriptEnabledAndroid={true}
        sharedCookiesEnabled={true}
        onLoadStart={() => {
          setIsLoading(true);
        }}
        onLoadEnd={() => {
          onPageLoad();
          setIsLoading(false);
        }}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      />
      <BottomMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:70,
  },
  loadingContainer: {
    width:'100%',
    height:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:Colors.background,
  },
});

export default withLoadingOverlay(CheckoutScreen);
