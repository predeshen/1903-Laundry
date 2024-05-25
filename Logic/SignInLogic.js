import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const fetchSignInToken = async (username, password) => {
    const response = await axios.post('https://1903laundry.co.za/wp-json/jwt-auth/v1/token', {
      username: username,
      password: password,
    });

    if (response.data.token) {
      const token = response.data.token;
      return token;
    } else {
      throw new Error('Sign-in failed. Invalid credentials.');
    }
};

const fetchSecondRequestToken = async (username, password) => {
    const requestBody = {
      username: username,
      password: password
    };

    const response = await fetch('https://1903laundry.co.za/wp-json/api/v1/mo-jwt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();
    
    return responseData.jwt_token;

};

export { fetchSignInToken, fetchSecondRequestToken };
