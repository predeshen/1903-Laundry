import React, { useState ,useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomMenu from '../components/BottomMenu';
import { headerFontStyle } from '../fonts';
import TopBar from '../components/TopBar';
import * as SecureStore from 'expo-secure-store';
import { Colors, CommonStyles } from '../theme'; // Import the theme styles
import withLoadingOverlay from '../components/withLoadingOverlay';
import { getCartItems, removeFromCart, clearCart } from '../services/CartService';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';
import {CustomAlert} from '../components/CustomAlert';

const CartScreen = ({ route  , startLoading, stopLoading  }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const isFocused = useIsFocused();
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseAlert = ()=> {
    setShowAlert(false);
  };
  
  useEffect(() => {
    if (isFocused) {
      fetchCartData();
    }
  }, [isFocused]);

  const fetchCartData = async () => {
    try {
      const userToken = await SecureStore.getItemAsync('userToken');
      if (userToken) {
        const response = await fetch('https://1903laundry.co.za/wp-json/wc/store/cart/', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        const cartData = await response.json();
        if (Array.isArray(cartData.items)) {
          const updatedCart = cartData.items.map(item => ({
            ...item,
            prices: {
              ...item.prices,
              price: parseFloat(item.prices.price) / 100,
            },
          }));
          setCart(updatedCart);
          setCartTotal(calculateTotal(updatedCart));
        } else {
         // console.error('Fetched cart items are not an array:', cartData.items);
          console.error('Error fetching cart data');    
          return;      
        }
      }
    } catch (error) {
      console.error('Error fetching cart data');    
      return;

      }
  };

  const calculateTotal = items => {
    stopLoading();
    return items.reduce((total, item) => total + item.prices.price, 0);
  };

    const handleRemoveFromCart = async (key) => {
    try {
      await removeFromCart(key);
      // Refresh the cart data after removal
      fetchCartData();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return;

    }
  };
  
  //console.log(cart);
  const renderCartItem = ({ item }) => (
    <View style={[CommonStyles.button, styles.cartItem]}>
      <Image source={{ uri: item.images[0]?.src }} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={[CommonStyles.buttonTextNormal, styles.cartItemName]}>{item.name}</Text>
          <Text style={CommonStyles.buttonTextNormal, styles.cartItemPrice}>           
             Size: {getVariationFromPermalink(item.permalink)}
          </Text>
        

        <Text style={styles.cartItemPrice}>Price: R{item.prices.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveFromCart(item.key)}>
      {isLoading ? (
            <ActivityIndicator color={Colors.body} />
          ) : (
            <Icon name="trash" size={24} color='white' />
          )}
      </TouchableOpacity>
    </View>
  );

// Define a function to get the variation from the permalink
const getVariationFromPermalink = (permalink) => {
  const match = permalink.match(/attribute_pa_sizing=(\d+)/);
  if (match) {
    return match[1]; // This will return "34" from the permalink.
  }
  return "N/A"; // Return a default value if not found.
};
  const handleCheckout = async () => {
    if (cart.length === 0) {
      // Display an alert message if the cart is empty
      setAlertMessage("Your cart is empty. Please add items to your cart before checking out.");
      setShowAlert(true);
    } 
    else
    {
    try {
      const autoLoginUserToken = await SecureStore.getItemAsync('autoLoginUserToken');

      if (!autoLoginUserToken) {
        console.error('User token is missing.');
        return;
      }

      const checkoutUrl = `https://1903laundry.co.za/cart?mo_jwt_token=${autoLoginUserToken}`;
      navigation.navigate('CheckoutScreen', { checkoutUrl });
    } catch (error) {
      console.error('Error handling checkout:', error);
      return;
    }
    }

  };

  const handleEmptyCart = async() => {
    await clearCart();
    setCartTotal(0);
    fetchCartData();
  };


  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Cart</Text>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCartItem}
          contentContainerStyle={styles.cartList}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.cartTotal}>R{cartTotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.emptyButton} onPress={handleEmptyCart}>
        <Text style={styles.emptyButtonText}>Empty Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Check Out</Text>
      </TouchableOpacity>
      </View>
      <BottomMenu navigation={navigation} cartItems={cart} />
      <CustomAlert
                  isVisible={showAlert}
                  onClose={handleCloseAlert}
                  message={alertMessage}
        />
    </View>
    
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },

  emptyButton: {
    color: Colors.background,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  checkoutButton: {
    color: Colors.background,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: Colors.background,
    fontSize: 16,
  },
  cartItemVariation: {
    fontSize: 14,
    color: '#777',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom:10,
  },
  title: {
    ...headerFontStyle,
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  cartList: {
    paddingHorizontal: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    marginRight: 10,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 18,
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 18,
    color: Colors.background,
  },
  deleteIcon: {
    marginLeft: 10,
    color: Colors.background,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    marginRight: 10,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dd3333',
  },
  checkoutButton: {
    backgroundColor: '#dd3333',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60, // Adjust this value as needed
    backgroundColor: '#fff', // Set a background color for the bottom container
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
});

export default withLoadingOverlay(CartScreen);

