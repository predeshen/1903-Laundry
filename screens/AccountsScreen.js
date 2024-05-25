
import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View,StyleSheet,ActivityIndicator,Text} from 'react-native';
import TopBar from '../components/TopBar';
import BottomMenu from '../components/BottomMenu';
import { useNavigation } from '@react-navigation/native';
import withLoadingOverlay from '../components/withLoadingOverlay';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '../theme';
import PregnantLadyAnimation3 from '../components/LoadingBar3';

const AccountsScreen = ({ route , startLoading, stopLoading }) => {
  
  const navigation = useNavigation();

  const [isLoaded, setIsLoaded] = useState(false);
  const webViewRef = useRef(null);
  const userToken = SecureStore.getItemAsync('userToken');
  const [isLoading, setIsLoading] = useState(true);
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
      style.appendChild(document.createTextNode('.mkdf-content    { background-color: antiquewhite; }'));
      style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--downloads {display: none;}'));
      style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--orders {display: none; }'));
      style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--contributions { display: none;}'));
      style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--customer-logout { display: none;}'));
      style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--dashboard {display: none;}'));
      style.appendChild(document.createTextNode('nav.woocommerce-MyAccount-navigation { background-color: antiquewhite !important; ; }'));
      style.appendChild(document.createTextNode('p.order-again {display: none;}'));
      style.appendChild(document.createTextNode('.mkdf-container-inner.clearfix {padding: 0px !important;}'));
      style.appendChild(document.createTextNode('.mkdf-title-holder.mkdf-standard-type.mkdf-title-va-header-bottom {display: none;}'));
      style.appendChild(document.createTextNode('div#ht-ctc-chat {display: none;}'));
      document.head.appendChild(style);
    })();
  `;

  const onPageLoad = () => {
      webViewRef.current.injectJavaScript(injectedJavaScript);
      stopLoading();
  };

  useEffect(() => {
    const fetchToken = async () => {
      const autoLoginUserToken = await SecureStore.getItemAsync('autoLoginUserToken');
      //console.log(await autoLoginUserToken);
      setUrl(`https://hannahgracematernity.co.za/my-account/?mo_jwt_token=${autoLoginUserToken}`);
    };
  
    fetchToken();
  }, []);

  return (
    <View style={styles.container}>
      <TopBar />
      {isLoading && (
        <View style={styles.loadingContainer}>
           <PregnantLadyAnimation3 /> 
          <ActivityIndicator size="large" color="#dd3333" />
          <Text>Loading...</Text>
        </View>
      )}
    <WebView
      originWhitelist={['*']}
      incognito={false}
      ref={webViewRef}
      source={{ uri:Url }}
      javaScriptEnabled={true}
      javaScriptEnabledAndroid={true}
      sharedCookiesEnabled={true}
      onLoadStart={() => {
        setIsLoading(true);
      }}
      onLoadEnd={() => {
        // Notify the app that loading has started
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


export default withLoadingOverlay(AccountsScreen); // Use the withLoading HOC

