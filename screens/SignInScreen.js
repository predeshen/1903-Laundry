import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, CommonStyles } from '../theme';
import { fetchSignInToken, fetchSecondRequestToken } from '../Logic/SignInLogic';
import withLoadingOverlay from '../components/withLoadingOverlay';
import { lazy, Suspense } from 'react';
import {wooCommerce,WooCommerce} from '../services/WooCommerceClient';
import Toast from 'react-native-root-toast';

const SignInScreen = ({ startLoading, stopLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (errorText) {
      Alert.alert('Error', errorText);
      setErrorText('');
    }
  }, [errorText]);

  const handleSignIn = async () => {
    if (isLoading) return;

    setIsLoading(true);
      const token = await fetchSignInToken(username, password);
      

      const autoLoginUserToken = await fetchSecondRequestToken(username, password);
      await SecureStore.setItemAsync('username', username);
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('autoLoginUserToken', autoLoginUserToken);
      
      Promise.all([
        import('../screens/OrdersScreen'),
        import('../screens/AccountsScreen'),
      ])
        .then(([OrdersScreen, AccountsScreen]) => {
          setIsLoading(false);
          Toast.show('Successful login', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: '#DD3333',
            textColor: '#1C242A',
            opacity: 0.8,
            textStyle: {fontSize: 24,fontWeight: 'thin'},
            containerStyle: {width: '100%'},        
          });
          // Once both components are loaded, navigate to the desired screen
          navigation.navigate('InstagramStyleScreen');
        })
        .catch((error) => {
          setErrorText('Error preloading components:', error);
        });
    

  };
  
  const checkIfEmailExists = async () => {
    try {
      const response = await wooCommerce.get('customers', {
        params: {
          email: username,
          context: 'view',
        },
      });
      return await response.data;
    } catch (error) {
      return [];
    }
  };
  
  const handleSingIn2 = async () => {

    const user = await checkIfEmailExists();
    if(user.length>0)
    {
      handleSignIn();
    }
    else{
      setErrorText('Account does not exist. Would you like to create an account?');
      setIsValidEmail(true);
    }
  };

  const handleSignUp = () => {
    setIsLoading(true);
    navigation.navigate('SignUpScreen', { email: username, password });
  };

  const isSignInButtonDisabled = !username || !password || isLoading;
  const isSignUpButtonDisabled =  !isValidEmail
  return (
    <View style={[CommonStyles.container, styles.container]}>
    <Text style={CommonStyles.headerText}>1903 Laundry</Text>
    <Text style={styles.header}>Welcome to 1903 Laundry</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
          value={username}
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[
            CommonStyles.button,
            styles.signInButton,
            isSignInButtonDisabled && { opacity: 0.5 },
          ]}
          onPress={handleSingIn2}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.body} />
          ) : (
            <Text style={[CommonStyles.buttonText]}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[CommonStyles.button, 
            styles.signUpButton,
            isSignUpButtonDisabled && { opacity: 0.5 },]}
           onPress={handleSignUp}
        >
          <Text style={[CommonStyles.buttonText]}>Create Account</Text>
        </TouchableOpacity>
      
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background, // Change the background color
  },
  logo: {
    width: 150, // Adjust the logo dimensions as needed
    height: 150,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'thin', 
    marginBottom: 20,
    color: Colors.body, // Change the text color
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border, // Change the border color
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.primary, // Change the input background color
    color: Colors.body, // Change the text color
  },
  signInButton: {
    borderRadius: 5,
    paddingVertical: 12,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: Colors.primary,
     // Change the button color
  },
  signUpButton: {
    borderRadius: 5,
    paddingVertical: 12,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: Colors.primary, // Change the button color
  },
});

export default SignInScreen;
