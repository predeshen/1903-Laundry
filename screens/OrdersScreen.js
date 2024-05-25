import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import TopBar from '../components/TopBar';
import BottomMenu from '../components/BottomMenu';
import { useNavigation } from '@react-navigation/native';
import withLoadingOverlay from '../components/withLoadingOverlay';
import { Colors } from '../theme';
import * as SecureStore from 'expo-secure-store';
import PregnantLadyAnimation2 from '../components/LoadingBar2';

const OrdersScreen = ({  startLoading, stopLoading }) => {
  const navigation = useNavigation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef(null);
  const [ordersUrl, setordersUrl] = useState('');
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
        style.appendChild(document.createTextNode('.mkdf-content    { background-color: antiquewhite !important; ; }'));
        style.appendChild(document.createTextNode('.mkdf-title-holder.mkdf-standard-type.mkdf-title-va-header-bottom { display: none;}'));
        style.appendChild(document.createTextNode('p.order-again {display: none;}'));
        style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--downloads {display: none;}'));
        style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--edit-account {display: none; }'));
        style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--contributions { display: none;}'));
        style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--customer-logout { display: none;}'));
        style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--dashboard {display: none;}'));
        style.appendChild(document.createTextNode('nav.woocommerce-MyAccount-navigation { background-color: antiquewhite !important; ; }'));
        style.appendChild(document.createTextNode('p.order-again {display: none;}'));
        style.appendChild(document.createTextNode('.mkdf-container-inner.clearfix {padding: 0px !important;}'));
        style.appendChild(document.createTextNode('div#ht-ctc-chat {display: none;}'));
        document.head.appendChild(style);
      })();
  `;

  const injectedJavaScriptTest = `
  alert("Injected JavaScript executed!");
`;

  const onPageLoad = () => {
      webViewRef.current.injectJavaScript(injectedJavaScript);
  };

  useEffect(() => {
    const fetchToken = async () => {
      const autoLoginUserToken = await SecureStore.getItemAsync('autoLoginUserToken');
      setordersUrl(`https://hannahgracematernity.co.za/my-account/orders/?mo_jwt_token=${autoLoginUserToken}`);
    };
  
    fetchToken();
  }, []);

  return (
    <View style={styles.container}>
      <TopBar />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <PregnantLadyAnimation2 /> 
          <ActivityIndicator size="large" color="#dd3333" />
          <Text>Loading...</Text>
        </View>
      )}
      <WebView
        originWhitelist={['*']}
        ref={webViewRef}
        source={{ uri: ordersUrl }}
        javaScriptEnabled={true}
        javaScriptEnabledAndroid={true}
        javaScriptEnabledIOS={true}
        sharedCookiesEnabled={true}
        onLoadStart={() => {
          setIsLoading(true);
        }}
        onLoadEnd={() => {
          onPageLoad();
          setIsLoading(false);
        }}
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
    backgroundColor:Colors.secondary,
  },
});

export default withLoadingOverlay(OrdersScreen);
