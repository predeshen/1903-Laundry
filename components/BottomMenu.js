import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {Image} from 'expo-image'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo package
import { Colors, Fonts, CommonStyles } from '../theme'; // Import the theme styles

const BottomMenu = ({ navigation, cartItems, cartCount  }) => {
  return (
    <View style={styles.bottomMenu}>
    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('InstagramStyleScreen')}>
      {/* <Ionicons name="md-home" size={24} color='#DD3333' style={styles.menuIcon} /> */}
      <Image
                  source={require('../assets/home.png')}
                  style={styles.menuIcon}
                />
      <Text style={[Fonts.header,styles.menuText]}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CartScreen', { cartItems: cartItems })}>
      {/* <Text style={[Fonts.header,styles.menuText]} color='#DD3333'>{cartCount}</Text> */}
      {/* <Ionicons name="md-cart" size={24} color='#DD3333' style={styles.menuIcon} /> */}
      <Image
                  source={require('../assets/carts.png')}
                  style={styles.menuIcon}
                />
                        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        )}
      <Text style={[Fonts.header,styles.menuText]}>My Cart</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('OrdersScreen')}>
      {/* <Ionicons name="md-basket" size={24} color='#DD3333' style={styles.menuIcon} /> */}
      <Image
                  source={require('../assets/orders.png')}
                  style={styles.menuIcon}
                />
      <Text style={[Fonts.header,styles.menuText]}>Orders</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AccountsScreen')}>
      {/* <Ionicons name="md-person" size={24} color='#DD3333' style={styles.menuIcon} /> */}
      <Image
                  source={require('../assets/account.png')}
                  style={styles.menuIcon}
                />
      <Text style={[Fonts.header,styles.menuText]}>My Account</Text>
    </TouchableOpacity>
  </View>
  
  );
};

const styles = StyleSheet.create({
    cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: Colors.background,
    paddingVertical: 10,
    position: 'absolute', // Set the position to absolute
    bottom: 0, // Set the bottom position to 0
    width: '100%', // Set the width to 100% of the screen
    paddingBottom:18,
  },
  menuItem: {
    alignItems: 'center',
  },
  menuIcon: {
    width:40,
    height:40,
    marginBottom: 5,
  },
  menuText: {
    fontSize: 12,
    color: '#555',
  },
});

export default BottomMenu;
