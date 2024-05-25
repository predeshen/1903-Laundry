import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { CommonStyles } from '../theme';
export const CustomAlert = ({ isVisible, onClose, message }) => {
    return (
      <Modal isVisible={isVisible}>
        <View style={styles.alertContainer}>
          <Text style={styles.alertMessage}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    alertContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    alertMessage: {
      fontSize: 18,
      marginBottom: 10,
    },
    closeButton: {
      ...CommonStyles.button,
      ...CommonStyles.buttonText, // Customize the close button style
      padding: 10,
      borderRadius: 5,
      alignSelf: 'flex-end',
    },
    closeButtonText: {
      ...CommonStyles.buttonText,
      color: 'white', // Customize the close button text color
      fontWeight: 'bold',
    },
  });
  